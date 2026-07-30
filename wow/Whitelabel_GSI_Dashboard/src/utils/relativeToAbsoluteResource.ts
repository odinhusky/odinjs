/**
 * 用於將資源的相對位址轉換為絕對位址，以便取得其他環境的資源
 * **development** ${env.VITE_DEV_RESOURCE_DOMAIN}/${resourceUrl}
 * **production** ${window.location.origin}/${resourceUrl}
 *
 * @param resourceUrl 資源的相對位址
 * @returns 轉換後資源的絕對位址
 */
export default function (resourceUrl: string | URL): URL {
  // process.env不可使用解構，必須直接引用process.env內的變數
  // https://github.com/quasarframework/quasar/issues/16889
  const VITE_DEV_RESOURCE_DOMAIN = process.env.VITE_DEV_RESOURCE_DOMAIN
  const baseUrl = process.env.DEV && VITE_DEV_RESOURCE_DOMAIN ? VITE_DEV_RESOURCE_DOMAIN : window.location.origin
  const url = new URL(resourceUrl, baseUrl)
  return url
}

export function replaceSubdomain(url: string, subdomain?: string): string {
  return new URL(url.replace(/^(https?:\/\/)(www\.)?([^.])*/, `$1$2${subdomain}`)).href
}
