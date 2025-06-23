import { Md5 } from 'ts-md5';
import { v4 as uuidv4 } from 'uuid';

type Hasher = (input: string, seed: number) => number;

class Fingerprint {
  hasher?: Hasher;
  canvas?: boolean;

  constructor(options?: { hasher?: Hasher; canvas?: boolean }) {
    this.hasher = options?.hasher;
    this.canvas = options?.canvas;
  }

  // 遍歷方法
  each<T>(array: T[], callback: (item: T, index: number, arr: T[]) => void) {
    if (!array) return;
    array.forEach(callback);
  }

  // 映射方法
  map<T, U>(
    array: T[],
    callback: (item: T, index: number, arr: T[]) => U
  ): U[] {
    if (!array) return [];
    return array.map(callback);
  }

  // 類似UUID格式轉換
  numberToUUID(num: number): string {
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

  // Murmurhash3 算法實現
  murmurhash3_32_gc(key: string, seed: number): number {
    const remainder = key.length % 4;
    const bytes = key.length - remainder;
    let h1 = seed;
    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    let i = 0;
    while (i < bytes) {
      let k1 =
        (key.charCodeAt(i) & 0xff) |
        ((key.charCodeAt(++i) & 0xff) << 8) |
        ((key.charCodeAt(++i) & 0xff) << 16) |
        ((key.charCodeAt(++i) & 0xff) << 24);
      ++i;

      k1 =
        ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) &
        0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 =
        ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) &
        0xffffffff;

      h1 ^= k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      const h1b =
        ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
      h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
    }

    let k1 = 0;

    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        break;
      // falls through
      case 2:
        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        break;
      // falls through
      case 1:
        k1 ^= key.charCodeAt(i) & 0xff;
        k1 =
          ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) &
          0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 =
          ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) &
          0xffffffff;
        h1 ^= k1;
        break;
    }

    h1 ^= key.length;
    h1 ^= h1 >>> 16;
    h1 =
      ((h1 & 0xffff) * 0x85ebca6b +
        ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
      0xffffffff;
    h1 ^= h1 >>> 13;
    h1 =
      ((h1 & 0xffff) * 0xc2b2ae35 +
        ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
      0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
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
      document.body
        ? typeof (document.body as any).addBehavior
        : typeof undefined,
      // document.body ? 'addBehavior' in document.body : undefined,
      typeof (window as any).openDatabase,
      (navigator as any).cpuClass,
      // 'cpuClass' in navigator ? (navigator as any).cpuClass : undefined,
      navigator.platform,
      navigator.doNotTrack,
      this.getPluginsString(),
    ];

    if (this.canvas && this.isCanvasSupported()) {
      components.push(this.getCanvasFingerprint());
    }

    const data = components.join('###');
    const uuid = this.getUUid();
    if (this.hasher) {
      return Md5.hashStr(`${uuid}${this.numberToUUID(this.hasher(data, 31))}`);
    } else {
      return Md5.hashStr(
        `${uuid}${this.numberToUUID(this.murmurhash3_32_gc(data, 31))}`
      );
    }
  }

  getUUid(): string {
    const uuid: string | null = window.localStorage.getItem('device_id');
    if (uuid === null) {
      const _uuid = uuidv4();
      window.localStorage.setItem('device_id', _uuid);
      return _uuid;
    } else {
      return window.localStorage.getItem('device_id') || '';
    }
  }

  hasLocalStorage(): boolean {
    try {
      return !!window.localStorage;
    } catch {
      return true;
    }
  }

  hasSessionStorage(): boolean {
    try {
      return !!window.sessionStorage;
    } catch {
      return true;
    }
  }

  hasIndexDb(): boolean {
    try {
      return !!window.indexedDB;
    } catch {
      return true;
    }
  }

  isCanvasSupported(): boolean {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }

  isIE(): boolean {
    return (
      navigator.appName === 'Microsoft Internet Explorer' ||
      (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent))
    );
  }

  getPluginsString(): string {
    return this.isIE()
      ? this.getIEPluginsString()
      : this.getRegularPluginsString();
  }

  getRegularPluginsString(): string {
    return this.map(Array.from(navigator.plugins), (plugin: Plugin) => {
      const pluginDetails = this.map(
        Array.from(plugin),
        (mimeType: MimeType) => {
          return `${mimeType.type}~${mimeType.suffixes}`;
        }
      ).join(',');

      return `${plugin.name}::${plugin.description}::${pluginDetails}`;
    }).join(';');
  }

  getIEPluginsString(): string {
    if (typeof (window as any).ActiveXObject !== 'undefined') {
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
          new (window as any).ActiveXObject(plugin);
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

  getScreenResolution(): [number, number] {
    return screen.height > screen.width
      ? [screen.height, screen.width]
      : [screen.width, screen.height];
  }

  getCanvasFingerprint(): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
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

// Java Hash Code function
export const javaHashCode = (string: string, K: number): number => {
  let hash = 0;
  if (string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = K * ((hash << 5) - hash) + char;
    hash &= hash;
  }
  return hash >>> 0;
};

export default new Fingerprint({ hasher: javaHashCode });
