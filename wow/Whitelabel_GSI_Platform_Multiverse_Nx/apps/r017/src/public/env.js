/**
 * Runtime Environment Configuration
 *
 * Keep these keys aligned with the project's NUXT_PUBLIC_* variables:
 * NUXT_PUBLIC_API_BASE                  -> apiBase
 * NUXT_PUBLIC_AGENT_CODE                -> agentCode
 * NUXT_PUBLIC_IMAGE_BASE                -> imageBase
 * NUXT_PUBLIC_STATIC_RESOURCE_URL       -> staticResourceUrl
 * NUXT_PUBLIC_STATIC_RESOURCE_PROXY_TARGET -> staticResourceProxyTarget
 * NUXT_PUBLIC_SITE_KEY                  -> siteKey
 * NUXT_PUBLIC_APP_VERSION               -> appVersion
 * NUXT_PUBLIC_SHOW_MOCK_DATA            -> showMockData
 * NUXT_PUBLIC_THEME_FILE                -> themeFile
 */
;(function () {
  window.__ENV__ = {
    apiBase: "https://api-stagingagent.gsiwl.com",
    agentCode: "GSI2",
    imageBase: "https://wowdata.gpsriowdl.com/gsi/staging/SITS",
    staticResourceUrl: "/statics/staging",
    staticResourceProxyTarget: "https://gsi2.gsiwl.com",
    siteKey: "set_r017",
    appVersion: "0.0.3",
    showMockData: "false",
    themeFile: "default.css"
  }
})()
