import { PageOrModalPathEnum } from '../../app/ui/PageOrModalPathEnum';

// Modal 限定出現在首頁的白名單
export const queueModalShowPages = [`${PageOrModalPathEnum.IndexPage}`];

// Modal 不能出現的黑名單
export const queueModalCantShowPages = [`${PageOrModalPathEnum.GamePage}`];
