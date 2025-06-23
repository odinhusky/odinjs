// 原本是：import { Md5 } from 'ts-md5';
// JavaScript 建議你使用 CDN 或外部 script 來引入 Md5 函數（或使用第三方函數庫）
// import { Md5 } from 'ts-md5'; // 或手動改用其他 hash 實作

class Fingerprint {
  constructor(options) {
    this.hasher = options?.hasher;
    this.canvas = options?.canvas;
  }

  each(array, callback) {
    if (!array) return;
    array.forEach(callback);
  }

  map(array, callback) {
    if (!array) return [];
    return array.map(callback);
  }

  numberToUUID(num) {
    let hex = BigInt(num).toString(16);
    if (hex.length < 32) {
      hex = hex.padStart(32, '0');
    } else if (hex.length > 32) {
      hex = hex.slice(-32);
    }

    const uuid = [
      hex.substring(0, 8),
      hex.substring(8, 12),
      hex.substring(12, 16),
      hex.substring(16, 20),
      hex.substring(20, 32),
    ].join('-');

    return uuid;
  }

  murmurhash3_32_gc(key, seed) {
    // ...保持原樣
  }

  get() {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      this.getScreenResolution().join('x'),
      new Date().getTimezoneOffset(),
      this.hasSessionStorage(),
      this.hasLocalStorage(),
      this.hasIndexDb(),
      document.body ? typeof document.body.addBehavior : typeof undefined,
      typeof window.openDatabase,
      navigator.cpuClass,
      navigator.platform,
      navigator.doNotTrack,
      this.getPluginsString(),
    ];

    if (this.canvas && this.isCanvasSupported()) {
      components.push(this.getCanvasFingerprint());
    }

    const data = components.join('###');
    const hashFunc = this.hasher || this.murmurhash3_32_gc.bind(this);
    return md5(this.numberToUUID(hashFunc(data, 31)));
  }

  hasLocalStorage() {
    try {
      return !!window.localStorage;
    } catch {
      return true;
    }
  }

  hasSessionStorage() {
    try {
      return !!window.sessionStorage;
    } catch {
      return true;
    }
  }

  hasIndexDb() {
    try {
      return !!window.indexedDB;
    } catch {
      return true;
    }
  }

  isCanvasSupported() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  isIE() {
    return (
      navigator.appName === 'Microsoft Internet Explorer' ||
      (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent))
    );
  }

  getPluginsString() {
    return this.isIE()
      ? this.getIEPluginsString()
      : this.getRegularPluginsString();
  }

  getRegularPluginsString() {
    return this.map(Array.from(navigator.plugins), (plugin) => {
      const pluginDetails = this.map(Array.from(plugin), (mimeType) => {
        return `${mimeType.type}~${mimeType.suffixes}`;
      }).join(',');
      return `${plugin.name}::${plugin.description}::${pluginDetails}`;
    }).join(';');
  }

  getIEPluginsString() {
    if (typeof window.ActiveXObject !== 'undefined') {
      const activexPlugins = [
        'ShockwaveFlash.ShockwaveFlash',
        'AcroPDF.PDF',
        'PDF.PdfCtrl',
        'QuickTime.QuickTime',
        'rmocx.RealPlayer G2 Control',
        'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
        'SWCtl.SWCtl',
        'WMPlayer.OCX',
        'AgControl.AgControl',
        'Skype.Detection',
      ];

      return this.map(activexPlugins, (plugin) => {
        try {
          new window.ActiveXObject(plugin);
          return plugin;
        } catch {
          return null;
        }
      })
        .filter(Boolean)
        .join(';');
    }

    return '';
  }

  getScreenResolution() {
    return screen.height > screen.width
      ? [screen.height, screen.width]
      : [screen.width, screen.height];
  }

  getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const text = 'CANVAS_FINGERPRINT';

    context.textBaseline = 'top';
    context.font = "14px 'Arial'";
    context.fillStyle = '#f60';
    context.fillRect(125, 1, 62, 20);
    context.fillStyle = '#069';
    context.fillText(text, 2, 15);
    context.fillStyle = 'rgba(102, 204, 0, 0.7)';
    context.fillText(text, 4, 17);

    return canvas.toDataURL();
  }
}

function javaHashCode(string, K) {
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = K * ((hash << 5) - hash) + char;
    hash &= hash;
  }
  return hash >>> 0;
}

const fingerprint = new Fingerprint({ hasher: javaHashCode });
