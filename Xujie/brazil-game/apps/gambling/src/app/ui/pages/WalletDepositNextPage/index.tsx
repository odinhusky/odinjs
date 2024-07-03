
import {WalletDepositNextPage as PWalletDepositNextPage} from './env/p1/WalletDepositNextPage';
import {WalletDepositNextPage as WWalletDepositNextPage} from './env/wild/WalletDepositNextPage';
import {WalletDepositNextPage as CWalletDepositNextPage} from './env/u1/WalletDepositNextPage';
import {WalletDepositNextPage as RWalletDepositNextPage} from './env/u2/WalletDepositNextPage';
import {WalletDepositNextPage as U5WalletDepositNextPage} from './env/u5/WalletDepositNextPage';
import {WalletDepositNextPage as U6WalletDepositNextPage} from './env/u6/WalletDepositNextPage';
import {WalletDepositNextPage as U7WalletDepositNextPage} from './env/u7/WalletDepositNextPage';

import { renderByUVersion } from "../../utils/renderByUVersion";

export const WalletDepositNextPage = renderByUVersion({
  "p1": PWalletDepositNextPage,
  "u1": CWalletDepositNextPage,
  "wild777bet": WWalletDepositNextPage,
  "u2": RWalletDepositNextPage,
  "u5": U5WalletDepositNextPage,
  "u6": U6WalletDepositNextPage,
  "u7": U7WalletDepositNextPage,
}, PWalletDepositNextPage);
