import { assocPath } from 'ramda';
import {
  catchError,
  combineLatest,
  delay,
  distinctUntilChanged,
  first,
  from,
  map,
  merge,
  of,
  retry,
  skip,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import {
  createIpcResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  UnlockWalletRequest,
  UnlockWalletResponse,
} from '../../../shared/ipcMessages';
import { Wallet } from '../../../shared/types';
import Logger from '../../logger';
import { Network } from '../context';
import { fromIPC, handleIPC } from '../rx.utils';
import { createWallet } from '../Wallet';
import { loadWallet, updateWalletMeta } from '../walletFile';

type WalletPair = { path: string; wallet: Wallet | null };
const walletPair = (path, wallet): WalletPair => ({ path, wallet });

const logger = Logger({ className: 'sources/wallet.ipc' });

const handleWalletIpcRequests = (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>,
  $networks: Subject<Network[]>
) => {
  // Utils
  const handleNewWalletPair = async (next: WalletPair) => {
    $wallet.next(next.wallet);
    $walletPath.next(next.path);
  };
  const updateWalletFile = async (next: WalletPair) => {
    if (!next.wallet) return;
    updateWalletMeta(next.path, next.wallet.meta).catch((err) =>
      logger.error(
        'updateWalletFile',
        err,
        `Can not update walletMeta by path: ${next.path}`
      )
    );
  };
  // Handlers
  const $nextWallet = merge(
    //
    handleIPC(
      ipcConsts.W_M_UNLOCK_WALLET,
      ({ path, password }: UnlockWalletRequest) =>
        from(
          loadWallet(path, password).then((wallet) => ({
            pair: walletPair(path, wallet),
            error: null,
          }))
        ).pipe(
          catchError((error: Error) =>
            of({ pair: walletPair('', null), error })
          )
        ),
      ({ pair, error }): UnlockWalletResponse =>
        createIpcResponse(error, pair?.wallet?.meta)
    ).pipe(map(({ pair }) => pair)),
    //
    handleIPC(
      ipcConsts.W_M_CREATE_WALLET,
      (data: CreateWalletRequest) => from(createWallet(data)),
      ({ path }): CreateWalletResponse => createIpcResponse(null, { path })
    ),
    //
    fromIPC<number>(ipcConsts.SWITCH_NETWORK).pipe(
      switchMap((netId) =>
        combineLatest([of(netId), $wallet, $walletPath, $networks])
      ),
      first(),
      switchMap(([netId, wallet, path, nets]) => {
        if (nets.length === 0)
          return throwError(() => Error('No networks to switch on'));
        if (!wallet) return throwError(() => Error('No opened wallet'));

        const selectedNet = nets.find((net) => net.netID === netId);
        if (!selectedNet) return throwError(() => Error('No network found'));

        return of(
          walletPair(path, assocPath(['meta', 'netId'], netId, wallet))
        );
      }),
      retry(3),
      delay(1000),
      catchError(() => of(walletPair('', null)))
    )
  );

  const subs = [
    // Update wallet in state
    $nextWallet.subscribe(handleNewWalletPair),
    // Store new wallet on FS
    $nextWallet
      .pipe(skip(1), distinctUntilChanged())
      .subscribe(updateWalletFile),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

export default handleWalletIpcRequests;
