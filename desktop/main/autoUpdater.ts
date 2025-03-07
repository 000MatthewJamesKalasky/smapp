import os from 'os';
import { unlink } from 'fs/promises';
import { BrowserWindow, Notification } from 'electron';
import { ProgressInfo } from 'builder-util-runtime';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import logger from 'electron-log';
import { SemVer } from 'semver';
import { Subject } from 'rxjs';

import pkg from '../../package.json';
import { ipcConsts } from '../../app/vars';
import { isNetError, fetch } from '../utils';
import { isDev } from '../envModes';
import { Network } from '../../shared/types';
import { verifySignature } from '../verifyFileSignature';
import { isDebPackage } from '../../shared/utils';
import { GPG_PUBLIC_KEY_URL } from './constants';

autoUpdater.logger = logger;

// IPC

const notify = <T extends unknown>(channel: ipcConsts) => (
  mainWindow: BrowserWindow,
  info: T
) => {
  if (mainWindow) {
    mainWindow.webContents.send(channel, info);
    return true;
  } else return false;
};

export const notifyUpdateAvailble = notify<UpdateInfo>(ipcConsts.AU_AVAILABLE);
export const notifyDownloadProgress = notify<ProgressInfo>(
  ipcConsts.AU_DOWNLOAD_PROGRESS
);
export const notifyUpdateDownloaded = notify<UpdateInfo>(
  ipcConsts.AU_DOWNLOADED
);
export const notifyDownloadStarted = notify<void>(
  ipcConsts.AU_DOWNLOAD_STARTED
);
export const notifyDownloadManually = notify<string>(
  ipcConsts.AU_DOWNLOAD_MANUALLY
);
export const notifyNoUpdates = notify<void>(ipcConsts.AU_NO_UPDATES_AVAILABLE);
export const notifyError = notify<Error>(ipcConsts.AU_ERROR);

// Utils
export const getCurrentVersion = () =>
  isDev() ? new SemVer(pkg.version) : autoUpdater.currentVersion;

//

const getFeedUrl = (baseUrl: string, semver: string) => `${baseUrl}/v${semver}`;

export enum UpdateInfoStatus {
  UpdateAvailable = 0,
  UpdateNotAvailable,
  UpdateManually,
}

type CheckUpdateResults =
  | { status: UpdateInfoStatus.UpdateAvailable; updateInfo: UpdateInfo }
  | { status: UpdateInfoStatus.UpdateNotAvailable }
  | { status: UpdateInfoStatus.UpdateManually; version: string };

export const checkUpdates = async (
  mainWindow: BrowserWindow,
  currentNetwork: Network,
  autoDownload = false
): Promise<CheckUpdateResults> => {
  const currentVersion = getCurrentVersion();
  const { latestSmappRelease, smappBaseDownloadUrl } = currentNetwork;
  const isEqualVersion = currentVersion.compare(latestSmappRelease) === 0;

  if (isEqualVersion) {
    return { status: UpdateInfoStatus.UpdateNotAvailable };
  }

  autoUpdater.allowDowngrade = true;
  autoUpdater.autoDownload = autoDownload;
  const feedUrl = getFeedUrl(smappBaseDownloadUrl, latestSmappRelease);
  autoUpdater.setFeedURL(feedUrl);
  try {
    const result = await autoUpdater.checkForUpdates();

    if (result) {
      return {
        status: UpdateInfoStatus.UpdateAvailable,
        updateInfo: result.updateInfo,
      };
    }

    if (isDebPackage()) {
      return {
        status: UpdateInfoStatus.UpdateManually,
        version: latestSmappRelease,
      };
    }
  } catch (err) {
    if (err instanceof Error && !isNetError(err)) {
      notifyError(mainWindow, err as Error);
    }
  }

  return { status: UpdateInfoStatus.UpdateNotAvailable };
};

export const installUpdate = () => {
  autoUpdater.quitAndInstall(true, true);
};

type DownloadedInfo = UpdateInfo & { downloadedFile: string };

const verifyAppSignature = async (updInfo: DownloadedInfo, curNet: Network) => {
  // Skip verifying GPG signature on non-linux platform
  if (os.platform() !== 'linux') return true;
  if (!updInfo.downloadedFile) {
    throw new Error('Can not find path to downloaded file');
  }
  const appImageFilename = updInfo.files.find((val) =>
    val.url.endsWith('.AppImage')
  )?.url;
  if (!appImageFilename) {
    throw new Error('Can not find URL to AppImage binary file');
  }
  const feedUrl = getFeedUrl(curNet.smappBaseDownloadUrl, updInfo.version);
  const url = `${feedUrl}/${appImageFilename}.sig`;
  const signature = await fetch(url).then((res) => res.buffer());
  const pubKey = await fetch(GPG_PUBLIC_KEY_URL)
    .then((res) => res.text())
    .catch((err) => {
      const origMessage = err.message;
      err.message = `Validation failed: Cannot download the GPG public key by URL: ${GPG_PUBLIC_KEY_URL}: ${origMessage}`;
      throw err;
    });
  return verifySignature(updInfo.downloadedFile, signature, pubKey);
};

export const subscribe = (
  mainWindow: BrowserWindow,
  currentNetwork: Network,
  $downloaded: Subject<UpdateInfo>
) => {
  autoUpdater.on('update-available', (info) => {
    const isOutdatedVersion =
      currentNetwork.minSmappRelease &&
      getCurrentVersion().compare(currentNetwork.minSmappRelease) === -1;
    if (isOutdatedVersion) {
      if (mainWindow.isMinimized()) {
        const notification = new Notification({
          title: `Spacemesh software requires a critical update: ${info.version}`,
          subtitle: 'Please update Spacemesh application as soon as possible.',
        });
        notification.show();
      }
    }

    logger.log('update-available', info);
    notifyUpdateAvailble(mainWindow, info);

    if (mainWindow.isMinimized()) {
      const currentVersion = getCurrentVersion();
      const notification = new Notification({
        title: `New version ${info.version} is available!`,
        subtitle: `Current version: ${currentVersion.format()}`,
        body: 'Open Smapp to install update.',
      });
      notification.on('click', () => {
        mainWindow.show();
        notification.close();
      });
      notification.show();
    }
  });
  autoUpdater.on('download-progress', (info: ProgressInfo) => {
    logger.debug('download-progress', info);
    notifyDownloadProgress(mainWindow, info);
  });
  autoUpdater.on('update-downloaded', async (info: DownloadedInfo) => {
    logger.log('update-downloaded', info);
    const isValid = await verifyAppSignature(info, currentNetwork).catch(
      (err) => {
        logger.error('update-downloaded: verification failed', err);
        notifyError(mainWindow, err);
        return false;
      }
    );
    autoUpdater.autoInstallOnAppQuit = isValid ?? true;
    if (isValid === false) {
      logger.error('update-downloaded: signature is not valid');
      await unlink(info.downloadedFile);
      notifyError(
        mainWindow,
        new Error('Signature is not valid, cancelling update')
      );
    } else {
      logger.log('update-downloaded: ready to install');
      notifyUpdateDownloaded(mainWindow, info);
      $downloaded.next(info);
    }
  });
  autoUpdater.on('error', (err: Error) => {
    if (!isNetError(err)) {
      logger.error('update-error', err);
      if (err.message !== 'The command is disabled and cannot be executed') {
        // Since we're showing prompt on close and blocking exiting Smapp
        // without User's confirmation — it makes autoUpdater fail with
        // such error, despite the chosen option: Cancel / Close / Keep.
        // However, if User chooses Close — it does not break the autoupdate.
        notifyError(mainWindow, err);
      }
    } else {
      logger.debug('update-error NetError:', err);
    }
  });
};

export const unsubscribe = () => autoUpdater.removeAllListeners();
