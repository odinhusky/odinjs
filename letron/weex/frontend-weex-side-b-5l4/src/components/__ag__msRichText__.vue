<template>
    <div class="wrapper">
        <div style="flex-direction: row">
            <div v-for="(item, index) in contentList1" :key="index">
                <text v-if="item.type == 'text'" class="__ag__messagelivechatcontent__" :class="[isAnchor? '__ag__anchor_text_color__' :'',isUpAssistant? '__ag__assistant_text_color__' :'',]" >{{ item.content }}</text>
            </div>
        </div>
    </div>
</template>

<script>
import util from './util.js'
export default {
    props: {
        data: {
            type: Object,
            default: function () {
                return {}
            }
        },
        isAnchor: {
            type: Boolean,
            default: false
        },
        isUpAssistant: {
            type: Boolean,
            default: false
        },
        userNicename: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            richTextwidth: 715,
            contentList: []
        }
    },
    computed: {
        contentList1() {
            let list = []
            if (!this.contentList || !this.contentList.length) {
                return []
            }
           
            let r = this.contentList[0]
            list.push(r)
            return list
        },
        ipx() {
            let deviceModel  = weex.config.env.deviceModel
            if(deviceModel>='iPhone10,6'){
                
                if(deviceModel=='iPhone12,8'){
                    return false
                }
                return true
            }
            if(deviceModel=='iPhone10,3'){
                return true
            }
            return false
        }
    },
    mounted() {
        this.handleContent()
    },
    methods: {
        handleContent() {
            //这个地方对数据做重新封装之后再添加到data里面去
            let data = this.data;

            let sw = util.calculationText(26, this.userNicename)

            if (this.isAnchor || this.isUpAssistant) {
                sw += 72 + 10
            }
            //定义当前行可用的展示空间，第一行的时候，默认就是设置的行宽
            let richTextwidth = this.ipx ? this.richTextwidth + 10 : this.richTextwidth - 30
            let w = richTextwidth - sw
            //对data做判空处理，不为空时这里为true
            if (data && data.jsonContent) {
                //这个数组是我们对传入数组处理之后得到的新的数据源
                let tempContent = [];
                let contents = ''
                //对传入的数据源做for循环操作得到每一个具体的元素
                
                for (let i in data.jsonContent) {
                    let r = data.jsonContent[i]
                    if (r.type == 'text') {
                        //获取到当前索引下的content
                        let tempStr = r.content;
                        //strLength表示当前字符串的内容长度，默认是0
                        let strLength = 0;
                        //总长度做求和操作
                        strLength = util.calculationText(26, tempStr)
                        // 对比当前字符串长度是否小于当前可展示空间
                        if (strLength >= 0 && strLength <= w && !tempContent && !tempContent.length) {
                            //长度小于当前可用空间长度，直接存储到数组中
                            tempContent.push(r);
                        } else {
                            //截取当前字符串长度，按照当前可用空间做截取
                            let index = util.cutTextByWidth(r.content, w);
                            let content = r.content.substring(0, index)
                            contents = r.content.substring(index, r.content.length).trim()
                            let item1 = {
                                content: content,
                                type: r.type
                            };
                            tempContent.push(item1);
                            r.contents = contents
                        }
                    }
                }
                this.contentList = tempContent;
            }
        },
    }
}
</script>

<style lang="less" scoped>
@import '../style/theme.less';
.__ag__messagelivechatcontent__ {
    font-size: 13wx;
    color: #404040;
    line-height: 30px;
}
.__ag__anchor_text_color__ {
    color: @main-text-color;
}
.__ag__assistant_text_color__ {
    color: #F3A600;
}
</style>