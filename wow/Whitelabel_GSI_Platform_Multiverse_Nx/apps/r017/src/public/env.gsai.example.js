/**
 * GSAI runtime environment example.
 *
 * Copy this content to env.js when deploying the GSAI staging-style build.
 */
;(function () {
  window.__ENV__ = {
    apiBase: "https://api-devm-dev.gsiwl.com",
    agentCode: "GSAI",
    imageBase: "https://wowdata.gsiwl.com/gsi/dev/devm",
    staticResourceUrl: "/statics/staging",
    staticResourceProxyTarget: "https://gsai-dev.gsiwl.com",
    siteKey: "set_r017",
    appVersion: "1.0.0",
    showMockData: "true"
  }
})()
