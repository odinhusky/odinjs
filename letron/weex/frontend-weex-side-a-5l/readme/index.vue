<template>
  <div class="main">
    <div class="div" >
      
      <!-- <video auto-play="true" controls class="video" src="https://5lpullali.dasll.com/live/0a835fba7f5140ba87c8f135877e4c06.m3u8?auth_key=1643103988-db4c92fffc8c4b8680f135e18cc5be74-0-ee9c4d382b690d43b8ff014ce89fcea0">
      </video> -->

      <div>
          <text class="" @click="vibrate">铃声</text>
          
      </div>
      <div>
          <text class="" @click="pick">选择图片</text>
          <text >{{result}}</text>
      </div>

      <div>
          <text class="" @click="tolocal">切换到本地</text>
      </div>
      <div>
          <text class="" @click="statusbar(1)">状态栏白</text>
      </div>
      <div>
          <text class="" @click="statusbar(0)">状态栏黑</text>
      </div>

      <div>
          <text class="" @click="full(1)">横屏</text>
      </div>
      <div>
          <text class="" @click="full(0)">竖屏</text>
      </div>


      <div class="blue">
        <agairplay class="airplay">
          <text class="airplay-text">AA</text>
        </agairplay>
      </div>

      <div class="px">
        <text @click="setstore">set store</text>
        <input class="large-input" v-model="storevalue" />
      </div>
      <div class="px">
        <text @click="getstore">get store {{storevalue1}}</text>
      </div>



      <div class="px">
        <text @click="setkc">set kc</text>
        <input class="large-input" v-model="kcvalue" />
      </div>
      <div class="px">
        <text @click="getkc">get kc {{kcvalue1}}</text>
      </div>

      <div class="px">
        <text>height = {{height}}</text>
      </div>


      <div class="wx">
        <text>测试wx</text>
      </div>

      <div class="px">
        <text>测试px</text>
      </div>

      <div class="px" @click="down">
        <text>测试下载</text>
      </div>

      <text class="iconfont __ag__box-image__">&#xe672;</text>
      
      <text class="danmu" :class="[move?'danmu-move':'']">弹幕</text>




    </div>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      move:false,
      height:0,
      kcvalue: '',
      kcvalue1: '',
      storevalue: '',
      storevalue1: '',
      result: ''
    }
  },
  mounted(){
    console.log('在线版本')


    let domModule = weex.requireModule('dom')
      domModule.addRule('fontFace', {
        'fontFamily': 'iconfont',
        'src': "url('local:///iconfont.ttf')"
      })
// 'src': "url('https://at.alicdn.com/t/font_2231319_7o6stw5qu4p.ttf?t=1642410189461')"
    setInterval(()=>{
      this.move= false
      setTimeout(()=>{
        this.move = true
      }, 5000);


    }, 10000)


    this.checkHeight();
    setInterval(()=>{
      this.checkHeight()
    }, 2000)

   

  },
  mountedDownload(){

//     setInterval(()=>{

    

//                modal.toast({message: this.platform, duration:2})

                // });
//     }, 10000)
    
  },
  mounted1(){

              console.log('index mounted')

              const ws = weex.requireModule('webSocket');

              console.log('ws', ws)
            
              
              // ws.WebSocket('wss://im1.mixiangchina.com/ws','');

              ws.onopen ((event) => {
                console.log('onopen', event);
                ws.auth()
              })

              ws.onmessage ( (event) => {
                // console.log('onmessage', JSON.stringify(event));
                let j = JSON.parse(event.data)
                console.log('onmessage', JSON.stringify(j));
                // console.log('onmessage', event.data[0]);
              })

              ws.onclose ( (event) => {
                console.log('onclose', event);
              })

              ws.onerror ((event) => {
                console.log('onerror', event);
              })


          ws.WebSocket('ws://192.168.31.150:60402/ws','');

          ws.auth = ()=>{
            let auth = {action:'auth', token: 'cb67e18c70723aa6e662ba9eb2088905', id: 1, index: 1}
            let data = JSON.stringify(auth)
            console.log('send message', data)
            ws.send(data);
          }
          setTimeout(()=>{
            
          },2000)
              

          setInterval(()=>{
            let heart = {action:'heart', token: 'cb67e18c70723aa6e662ba9eb2088905', id: 1, index: 1}
            let data = JSON.stringify(heart)
            console.log('send message', data)
            ws.send(data);
                
            
          },6000)
              
  },
  methods:{
    vibrate(){

let agdevice = weex.requireModule('agdevice')
agdevice.vibrate()

    },
    pick(){
var ImageCropPicker = weex.requireModule('imageCropPicker')
var options = {
    width: 300,
    height: 300,
    includeExif: true,
    mediaType: 'photo',
    cropping: true
}
 ImageCropPicker.openPicker(options, (response) => {
                // 成功返回 {code:'E_SUCCESS', data:{...}}
                this.result = JSON.stringify(response)
            })
    },
    tolocal(){
      let agdownload = weex.requireModule('agdownload')
      agdownload.update()
    },
statusbar(b){
    let agdevice = weex.requireModule('agdevice')
    agdevice.setStatusBarStyle(b)
},
full(b){
      let agdevice = weex.requireModule('agdevice')
      agdevice.setLandscape(b)
},

    setstore(){
      let agstore = weex.requireModule('agstore')
      agstore.set('test', this.storevalue)
    },
    getstore(){
      let agstore = weex.requireModule('agstore')
      this.storevalue1 = agstore.get('test')
    },
    setkc(){
      let agkey = weex.requireModule('agkey')
      agkey.set('test', this.kcvalue)
    },
    getkc(){
      let agkey = weex.requireModule('agkey')
      this.kcvalue1 = agkey.get('test')
    },
    checkHeight(){

      
      this.height = this.height==111 ? weex.config.env.deviceHeight :111;

    },
    down(){
      const download = weex.requireModule('agdownload');
      download.download("https://cms-download.oss-cn-shanghai.aliyuncs.com/app/js.zip", (e)=>{
        
        if(!e){
          
          weex.requireModule('modal').toast({
            message: '下载失败',
            duration: 2
          })
          
          return;
        }
console.log('down', e);

        weex.requireModule('modal').toast({
            message: e,
            duration: 5
          })
          
      });
    }
  }
 
}
</script>

<style scoped>

.iconfont {
        font-family: iconfont;
        font-size: 48px;
        color: aliceblue;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }

.main {
  background-color: white;
  /* margin: 0; */
  /* border-width: 1px; */
  border-style: solid;
  border-color: red;
}

.div {
  flex: 1;
  justify-content: center;
  /* justify-items: center; */
}
.text {
  
  background-color: blue;
  float: right;
  width: 300px; 


padding: 20px;
margin: 20px;
  border-width: 0.5px;
  border-style: solid;
  border-color: red;
}

.video {
  width: 750px;
  height: 421.875px;
}

.danmu {
  position: fixed;
  left: 750px;
  top: 800px;
  color: white;
  background-color: rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  padding: 5px;
  transition-property:left;
  transition-duration: 4250;
}
.danmu-move {
  left:-100px;
}
.wx {
  margin: 20px;
  background-color: lightgray;
  border-width: 1wx;
  border-style: solid;
  border-color: lightsalmon;

}
.px {
  margin: 20px;
  background-color: lightgray;
  border-width: 1px;
  border-style: solid;
  border-color: lightsalmon;

}
.airplay {
  background-color: red;
  width:180px; 
  height:180px;
  position: relative;
}

.airplay-text {
  position: absolute;
  background-color: green;
  display: block;
  width:180px; 
  height:180px;
  text-align: center;
  line-height: 180px;
}

.blue {
  background-color: blue;
  height: 200px;
}
.large-input {
  height: 40px;
  line-height: 40px;
  display: block;
  background-color: yellow;
}
</style>
