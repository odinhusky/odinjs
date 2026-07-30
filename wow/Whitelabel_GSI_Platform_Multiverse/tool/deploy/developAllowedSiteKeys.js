/**
 * develop 分支執行 `pnpm deploy` / `pnpm deploy:all` 時，僅這些 template 會納入；
 * 其餘版型視為排除（等同 ignore）。
 * main / staging 分支不受此清單限制。
 */
const DEVELOP_ALLOWED_SITE_KEYS = new Set([
  'bmm_set_obtd',
  'okbet',
  'okbet_blackGold',
  'okbet_green',
  'okbet_red',
  'okbet_redBlack',
  'set_amuse',
  'set_DBO88',
  'set_ed3',
  'set_ed8888',
  'set_jokerhill',
  'set_r016',
  'set_r017',
  'set_r022',
  'set_r023',
  'set_r024',
  'set_r025',
  'set_royalslot88',
  'set33_GREEN',
  'set33_RED',
]);

module.exports = {
  DEVELOP_ALLOWED_SITE_KEYS,
};
