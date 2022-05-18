import * as $ from 'rxjs';
import { NodeConfig, Wallet } from '../../shared/types';

import { Network } from './context';
import { Managers } from './Networks';
import { MINUTE } from './constants';
import createMainWindow from './createMainWindow';
import observeStoreService from './sources/storeService';
import { fetchDiscovery, fetchDiscoveryEach } from './sources/fetchDiscovery';
import spawnManagers$ from './reactions/spawnManagers';
import switchNetwork from './reactions/switchNetwork';
import activateWallet from './reactions/activateWallet';
import ensureNetwork from './reactions/ensureNetwork';
import handleCloseApp from './reactions/handleCloseApp';
import handleWalletIpcRequests from './sources/wallet.ipc';
import syncToRenderer from './reactions/syncToRenderer';
import currentNetwork from './sources/currentNetwork';

const startApp = () => {
  // Create MainWindow
  const {
    $mainWindow,
    $quit,
    $isAppClosing,
    $showWindowOnLoad,
  } = createMainWindow();
  // Store
  const $storeService = observeStoreService();

  // Data
  const $wallet = new $.BehaviorSubject<Wallet | null>(null);
  const $walletPath = new $.BehaviorSubject<string>('');
  const $networks = new $.BehaviorSubject<Network[]>([]);
  const $currentNetwork = currentNetwork($wallet, $networks);
  const $nodeConfig = new $.Subject<NodeConfig>();
  const $managers = new $.Subject<Managers>();
  // @TODO:
  // const $currentLayer = new $.Subject<number>();

  // Reactions
  // List of unsubscribe functions
  const unsubs = [
    // Spawn managers (and handle unsubscribing)
    spawnManagers$($nodeConfig, $managers, $mainWindow),
    // On changing network -> update node config
    switchNetwork($currentNetwork, $nodeConfig, $mainWindow),
    // Activate wallet and accounts
    activateWallet($wallet, $managers),
    // Update networks on init
    fetchDiscovery($networks),
    // Update networks each N seconds
    fetchDiscoveryEach(60 * MINUTE, $networks),
    // If current network does not exist in discovery service
    // then ask User to switch the network
    ensureNetwork($wallet, $networks, $currentNetwork, $mainWindow),
    // Handle closing App
    handleCloseApp(
      $quit,
      $managers,
      $mainWindow,
      $isAppClosing,
      $showWindowOnLoad
    ),
    // Unlock / Create wallet
    // Switch network
    // @TODO: Recover wallet, Update meta, Update secrets
    handleWalletIpcRequests($wallet, $walletPath, $networks),
    // Push updates to Renderer process (redux via IPC)
    syncToRenderer(
      $mainWindow,
      $wallet,
      $walletPath,
      $storeService,
      $currentNetwork,
      $nodeConfig
    ),
  ];

  return {
    get: () =>
      $.firstValueFrom(
        $.combineLatest({
          $wallet,
          $walletPath,
          $networks,
          $currentNetwork,
          $nodeConfig,
          $managers,
        })
      ),
    unsubscribe: () => unsubs.forEach((unsub) => unsub()),
    subjects: {
      $networks,
    },
  };
};

export default startApp;
