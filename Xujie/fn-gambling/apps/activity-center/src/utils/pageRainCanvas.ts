export const loadImage: (url: string) => Promise<HTMLImageElement> = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error('load image error!'));
    };
  });
};
export const positionX = () => Math.random() * window.innerWidth;
export const randomRange = (start: number, end: number) => {
  const random = (end - start) * Math.random() + start;
  const number = 1;
  const arr = new Array(number).fill('').map((v, i) => random / (i + 1));
  return arr[Math.floor(Math.random() * number)];
};

type minMax = [number, number];
interface IConfigProps {
  selector: string;
  speedLimit: minMax;
  density: minMax;
  imgInfo: {
    w: number;
    h: number;
    urls: string[];
  };
  randomLimit: minMax;
  numberMaxLimit: number;
}
class PageRainCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  wid = 0;
  hei = 0;
  packedArr: ReturnType<typeof this.createPack>[] = [];
  clearTime: NodeJS.Timeout | null = null;
  imgEls: HTMLImageElement[] = [];
  requestId: number | null = null;
  config: IConfigProps = {
    selector: 'canvas',
    // speed value area
    speedLimit: [6, 10],
    // display quantity
    density: [5, 15],
    imgInfo: {
      // image width
      w: 50,
      // image height
      h: 50,
      urls: [],
    },
    // image rotate value area
    randomLimit: [0.5, 1],
    // image number max show
    numberMaxLimit: 20,
  };
  constructor(
    props: Partial<IConfigProps> & Pick<IConfigProps, 'selector' | 'imgInfo'>
  ) {
    this.config = {
      ...this.config,
      ...props,
    };
  }
  start() {
    Promise.all(this.config.imgInfo.urls.map((v) => loadImage(v))).then(
      (res) => {
        this.imgEls = res;
        this.wid = window.innerWidth;
        this.hei = window.innerHeight;
        this.initCanvas();
        this.pushPackArr();
        this.drawPacked();
      }
    );
  }

  initCanvas() {
    const canvas = document.getElementById(
      this.config.selector
    ) as HTMLCanvasElement;
    canvas.width = this.wid;
    canvas.height = this.hei;
    if (canvas.getContext) {
      // 判断是否有此方法，如果有才能进入
      this.ctx = canvas.getContext('2d');
    }
  }
  createPack() {
    const imgRandom = randomRange(...this.config.randomLimit);
    return {
      x: positionX(),
      y: 0,
      img: this.imgEls[
        Math.floor(randomRange(0, this.config.imgInfo.urls.length))
      ],
      // rotate
      rotate: randomRange(-45, 45),
      direction: Math.random(),
      speed: randomRange(...this.config.speedLimit),
      // rotate speed
      round: 0,
      roundSpeed: randomRange(1, 2),
      imgInfo: {
        w: this.config.imgInfo.w * imgRandom,
        h: this.config.imgInfo.h * imgRandom,
      },
    };
  }
  pushPackArr = () => {
    const [max, min] = this.config.density;
    const random = Math.floor(Math.random() * (max - min) + min);
    this.packedArr.push(
      ...new Array(random).fill('').map(() => this.createPack())
    );
    this.clearTime = setTimeout(() => {
      if (this.packedArr.length > this.config.numberMaxLimit)
        return this.clearTime && clearTimeout(this.clearTime);
      this.pushPackArr();
    }, 300);
  };
  drawPacked = () => {
    this.ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.packedArr.forEach((item) => {
      const r = ((item.rotate + item.round) * Math.PI) / 180;
      const temp = item.y - item.x * Math.tan(r);
      const top = temp * Math.cos(r);
      const left = item.x / Math.cos(r) + temp * Math.sin(r);
      this.ctx?.save();
      this.ctx?.rotate(r);
      this.ctx?.drawImage(
        item.img,
        left - item.imgInfo.w / 2,
        top - item.imgInfo.h / 2,
        item.imgInfo.w,
        item.imgInfo.h
      );
      this.ctx?.restore();
      if (item.direction < 0.5) {
        item.round -= item.roundSpeed;
      } else {
        item.round += item.roundSpeed;
      }
      if (item.y + item?.speed <= window.innerHeight) {
        item.y = item.y + item?.speed || 0;
      } else {
        // init
        item.y = 0 + item?.speed || 0;
        item.x = positionX();
        Object.assign(item, this.createPack());
      }
    });
    this.requestId = window.requestAnimationFrame(this.drawPacked);
  };

  stop() {
    // 停止产生新的红包
    if (this.clearTime) {
      clearInterval(this.clearTime);
      this.clearTime = null;
    }

    // 停止渲染
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    // 清空面板
    this.ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
export default PageRainCanvas;
