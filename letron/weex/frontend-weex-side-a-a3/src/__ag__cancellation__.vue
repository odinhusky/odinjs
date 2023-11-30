<template>
  <div class="__ag__cancellation_main__">
    <ag-hbtitle :isback="true" title="注销账号"></ag-hbtitle>
    <text
      class="__ag__modify-finsh__"
      :class="[ipx ? 'finsh-ipx' : '']"
      @click="__ag__cannel__"
      >取消</text
    >
    <div
      class="__ag__cancellation_content__"
      :class="[ipx ? 'cannel-ipx' : '']"
    >
      <div class="__ag__cancellation_box__" v-if="isCannel">
        <scroller
          class="__ag__indexscroller__"
          :show-scrollbar="false"
          @loadmore="loadmore"
        >
          <text class="__ag__agreement_tips__"
            >在您注销账号之前，为保障您的账号安全和相关权益，请您完整阅读并同意以下协议：</text
          >

          <div class="__ag__agreement_content__">
            <div class="__ag__agreement_title__">
              <text class="__ag__title_hard__">{{ env.hard }}</text>
              <text class="__ag__title_text__">账号注销协议 </text>
            </div>
            <div class="__ag__agreement_one__">
              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >尊敬的用户，在您正式开始下一步账号注销流程前，我们先为您做出如下特别说明：注销本</span
                >
                <span class="__ag__one_text primaryText">{{ env.hard }}</span>
                <span class="__ag__one_text"
                  >账号后，除法律法规另有规定外，您在该账号下的个人信息将进行删除或匿名化处理，且此前已关联该账号的相关产品与服务将不再关联。</span
                >
                <span class="__ag__one_text" style="font-weight: bold"
                  >该<span class="__ag__one_text primaryText">{{
                    env.hard
                  }}</span
                  >账号一旦注销完成，将无法恢复，请您谨慎操作。</span
                >
                <span class="__ag__one_text"
                  >若您经过慎重考虑后仍执意决定注销本账号的，请您务必先行仔细阅读和充分理解本《<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >》账号注销协议》（“本协议”），并同意本协议全部内容。您按照我们的注销操作流程开始注销流程的，或者您勾选本注销协议并开始下一步操作的，均视为您已经同意和遵守本协议全部内容。</span
                >

                <!-- <span class="__ag__one_text"></span>
                                <span class="__ag__one_text"></span>
                                <span class="__ag__one_text"></span> -->
              </richtext>
              <richtext
                style="
                  text-overflow: ellipsis;
                  line-height: 50wx;
                  margin-top: 20px;
                "
              >
                <span class="__ag__one_text"
                  >如您在注销后需要再次使用我们的服务的，欢迎您使用本产品提供的登录方式重新注册登录。</span
                >
              </richtext>

              <richtext
                style="
                  text-overflow: ellipsis;
                  line-height: 50wx;
                  margin-top: 20px;
                "
              >
                <span class="__ag__one_text" style="font-weight: bold"
                  >一、您知悉并同意：在您的<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >账号注销后，将（可能）产生包括但不限于如下结果，并需要您自行承担：</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text" style="font-weight: bold"
                  >1.
                  您将无法登录、使用该账号，您的好友或其他用户无法与您在<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >内进行互动，包括聊天、点赞、弹幕等；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text" style="font-weight: bold"
                  >2.
                  除法律法规另有规定外，您该账号下的个人信息将会被删除或匿名化处理。您无法再找回您的个人信息，也无权要求我们找回，前述个人信息包括但不限于：头像昵称等个人资料信息、设备信息、评论点赞、上传图片/视频信息、关注、播放历史、订阅/关注信息、弹幕等信息；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text" style="font-weight: bold"
                  >3. 本<span class="__ag__one_text primaryText">{{
                    env.hard
                  }}</span
                  >账号一旦注销，将无法恢复。即使您在注销后以相同或其他登录方式再次向我们申请注册登录的，此时该账号将视为新的用户账号。因此，我们善意地提醒您在申请注销前对需要备份的内容提前做好备份。同时，也建议您在申请注销前清除系统缓存；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text" style="font-weight: bold"
                  >4. 本<span class="__ag__one_text primaryText">{{
                    env.hard
                  }}</span
                  >账号一旦注销，您与我们签署的有关本<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >的《用户协议》终止（但已约定继续生效的除外）。但用户协议的终止并不影响账号注销前您使用本产品服务应当承担的相关责任，您仍需要对该账号注销前使用本产品服务的行为承担相应责任，包括但不限于可能产生的违约责任、损害赔偿责任及履约义务等；
                </span>
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text" style="font-weight: bold"
                  >5. 其他因账号注销（可能）产生的结果。</span
                >
              </richtext>

              <richtext
                style="
                  text-overflow: ellipsis;
                  line-height: 50wx;
                  margin-top: 20px;
                "
              >
                <span class="__ag__one_text"
                  >二、在您向我们申请注销<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >账号之前，为保障您的账号安全和相关权益，<span
                    class="__ag__one_text"
                    style="font-weight: bold"
                    >您需先行检查与确保您申请注销的账号已经同时满足以下条件</span
                  >，这些条件包括但不限于：</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >1.
                  该账号为您本人合法拥有并登录使用，且符合用户协议及相关说明规则中有关<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >账号的规定；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >2.
                  该账号处于安全状态：账号为正常使用中且无违规、被封、被盗等情形；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >3. 该账号中的相关权益已结清或得到妥善处理。<span
                    class="__ag__one_text"
                    style="font-weight: bold"
                    >请您妥善处理您的权益，可待相关权益使用完毕后再进行注销，若您未予以处理且继续进行账号注销流程，视为您自愿放弃该相关权益；</span
                  ></span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >4.
                  该账号无任何纠纷：包括投诉举报、被投诉举报、国家机关调查、仲裁、诉讼等纠纷；上述问题您可首先尝试自行处理，如您无法处理的或在处理过程中有任何疑惑的，可联系客服协助处理。</span
                >
              </richtext>

              <richtext
                style="
                  text-overflow: ellipsis;
                  line-height: 50wx;
                  margin-top: 20px;
                "
              >
                <span class="__ag__one_text" style="font-weight: bold"
                  >三、如何注销<span class="__ag__one_text primaryText">{{
                    env.hard
                  }}</span
                  >账号？</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >1.
                  您需按照我们的官方渠道提供的注销流程和操作指引，在相关功能设置页面进行注销操作；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >2.
                  您已经同意本注销协议的全部内容；同时，您已经检查与确认满足了本协议第二条的要求；</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >3.
                  在您完成上述第2点后，为进一步保障您的相关合法权益，我们有权但没有义务根据您的账号安全状态以及您的相关产品与服务的使用情况等综合判断您的账号是否符合注销条件。为保障您的账号安全和财产权益，我们有权进行注销申请的身份验证以判断您是该<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >账号的有权使用人（如由您提供操作相关信息供我们核实等）。如我们在综合判断后发现该账号不符合注销条件的，或者身份验证失败的，您的注销可能会失败，您可以按照我们的指引进行后续操作或联系客服协助处理。即使我们判断您符合注销条件的，也是基于您的承诺（即您自身确保<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >账号符合上述注销条件的承诺）进行的形式审查，仍由您自身对<span
                    class="__ag__one_text primaryText"
                    >{{ env.hard }}</span
                  >账号符合上述注销条件承担保证责任，我们对此不承担相应的法律责任；</span
                >
              </richtext>

              <richtext
                style="
                  text-overflow: ellipsis;
                  line-height: 50wx;
                  margin-top: 20px;
                "
              >
                <span class="__ag__one_text" style="font-weight: bold"
                  >四、其他</span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >本协议为用户协议组成部分，本协议未尽事宜适用用户协议。本协议与用户协议不一致的，以本协议为准。同时，您知悉并同意：<span
                    class="__ag__one_text"
                    style="font-weight: bold"
                    >即使您该<span class="__ag__one_text primaryText">{{
                      env.hard
                    }}</span
                    >账号被注销，也并不减轻或免除您应根据相关法律法规、相关协议、规则等（可能）需要承担的相关责任。</span
                  ></span
                >
              </richtext>

              <richtext style="text-overflow: ellipsis; line-height: 50wx">
                <span class="__ag__one_text"
                  >如在账号注销过程中有任何问题您无法处理的或在处理过程中有任何疑惑的，可联系客服协助处理。</span
                >
              </richtext>

              <text class="__ag__hard__">{{ env.hard }} </text>
            </div>
            <div class="__ag__login-service__" @click="service = !service">
              <text
                class="iconfont __ag__login-gou__"
                :class="[service ? 'gouselected' : '']"
                >&#xe682;</text
              >
              <text class="inline"
                >我已阅读并同意《{{ env.hard }}账号注销协议》</text
              >
            </div>
            <div class="__ag__next_btn__" @click="__ag__next__">
              <text
                class="__ag__btn_text__"
                :class="[!service ? '__ag__not_btn_text__' : '']"
                >下一步</text
              >
            </div>
          </div>
        </scroller>
      </div>
      <div class="__ag__cancellation_box__" v-else>
        <text class="__ag__two_tips__"
          >为防止误操作，请再次确认是否注销账号并确认注销后的影响：</text
        >
        <div class="__ag__submit_content__">
          <text class="__ag__submit_tips__"
            >1、该账号一旦注销，将无法恢复！</text
          >
          <text class="__ag__submit_title__"
            >2、即使您在注销后以相同或其他登录方式再次向我们申请注册登录，此时该账号将视为新的用户账号。</text
          >
          <text class="__ag__submit_title__"
            >因此，我们善意提醒您在申请注销前对需要备份的内容提前做好备份，并请再次确认与账号相关的所有服务均已妥善处理。</text
          >
        </div>
        <div class="__ag__submit_btn__">
          <div class="__ag__btn_lf__" @click="__ag__cannel__">
            <text class="__ag__btn_lf_text__">放弃</text>
          </div>
          <div class="__ag__btn_rg__" @click="__ag__submit__">
            <text class="__ag__btn_rg_text__">提交注销</text>
          </div>
        </div>
      </div>
    </div>
    <div
      class="__ag__model__"
      v-if="isModel"
      :class="[ipx ? 'model-ipx' : '']"
      @click="isModel = false"
    >
      <div class="__ag__model_wrapper">
        <div class="__ag__model_title__">
          <text class="iconfont __ag__feedback__" @click="__ag__onTips__"
            >&#xe69f;</text
          >
          <text class="__ag__model_tips__">确认提交注销</text>
        </div>
        <text class="__ag__model_content__"
          >点击确认提交，您的账号将立即注销，一旦成功注销，该账号下的所有信息将无法恢复。</text
        >
        <div class="__ag__model_btn__">
          <text class="__model_cannel__" @click.stop="isModel = false"
            >取消</text
          >
          <text class="__model_submit__" @click.stop="__ag__confirm__"
            >确认提交</text
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import agMinix from "./components/__ag__minix__.js"
import HbTitle from "./components/__ag__headTop__.vue"
import env from "./components/env.js"
import __ag__sportApi__ from "./components/__ag__sport_api__.js"
import __ag__sport from "./components/__ag__sport__.js"
import a__ag__util__ from "./components/util.js"
let backIndex = undefined
export default {
  components: {
    "ag-hbtitle": HbTitle,
  },
  mixins: [agMinix],
  data() {
    return {
      env,
      isCannel: true,
      service: false,
      isModel: false,
    }
  },
  created() {
    backIndex = new BroadcastChannel("backIndex")
  },
  destroyed() {
    backIndex.close()
  },
  methods: {
    __ag__cannel__() {
      a__ag__util__.pop()
    },
    loadmore() {},
    __ag__next__() {
      if (!this.service) {
        a__ag__util__.message(`请同意${env.hard}账号注销协议`)
        return
      }
      this.isCannel = false
    },
    __ag__submit__() {
      this.isModel = true
    },
    __ag__confirm__() {
      __ag__sportApi__
        .editUsersDelete()
        .then((resp) => {
          a__ag__util__.message(resp.message)
          this.isModel = false
          this.__ag__logout__()
          a__ag__util__.pop()
          backIndex.postMessage()
        })
        .catch((err) => {
          this.isModel = false
          a__ag__util__.message(err.message)
        })
    },
    __ag__logout__() {
      let guestToken = a__ag__util__.getItem("guestToken")
      a__ag__util__.setItem("token", guestToken)
      __ag__sport.__ag__infoUser_editGuest__()
    },
  },
}
</script>
<style scoped lang="less">
@import "./style/default.less";

.iconfont {
  font-family: iconfont;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
.primaryText {
  color: @primary;
}
.__ag__cancellation_main__ {
  position: fixed;
  top: 0;
  bottom: 0;
  width: @fullWidth;
  background-color: @white;
}
.__ag__modify-finsh__ {
  width: 50wx;
  height: 88px;
  position: fixed;
  top: 50px;
  right: 20px;
  color: @white;
  text-align: center;
  font-size: 14wx;
  line-height: 88px;
}
.finsh-ipx {
  top: 103px;
}
.__ag__cancellation_content__ {
  width: @fullWidth;
  position: fixed;
  bottom: 0px;
  top: 142px;
  flex-direction: column;
}
.cannel-ipx {
  top: 250px;
}
.__ag__indexscroller__ {
  width: @fullWidth;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: @white;
}
.__ag__cancellation_box__ {
  width: @fullWidth;
  position: absolute;
  top: 0;
  bottom: 0;
}
.__ag__agreement_tips__ {
  width: @fullWidth;
  padding: 15px;
  background-color: @primary;
  font-size: 11wx;
  line-height: 20wx;
  color: @white;
}
.__ag__two_tips__ {
  width: @fullWidth;
  padding: 15px;
  font-size: 14wx;
  line-height: 20wx;
  margin-top: 10px;
}
.__ag__agreement_content__ {
  width: @fullWidth;
  margin-top: 30px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 50px;
}
.__ag__agreement_title__ {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__ag__title_hard__ {
  color: @primaryLight;
  font-size: 15wx;
  font-weight: 500;
}
.__ag__title_text__ {
  font-size: 15wx;
  font-weight: 500;
}
.__ag__agreement_one__ {
  margin-top: 25px;
}
.__ag__one_text {
  font-size: 13wx;
  line-height: 25wx;
}
.__ag__one_content__ {
  margin-top: 15px;
}
.__ag__one_hard__ {
  font-size: 13wx;
  font-weight: bold;
  line-height: 25wx;
}
.__ag__hard__ {
  font-size: 13wx;
  font-weight: bold;
  line-height: 25wx;
  color: @primaryLight;
  text-align: right;
}
.__ag__login-service__ {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 15wx;
}
.__ag__login-gou__ {
  font-size: 40px;
  margin-right: 8px;
  color: #596379;
}
.gouselected {
  font-size: 40px;
  margin-right: 8px;
  color: @primary;
}
.__ag__next_btn__ {
  width: 718px;
  height: 80px;
  justify-content: center;
  border-radius: 40wx;
  margin-top: 20px;
}
.__ag__btn_text__ {
  font-size: 35px;
  text-align: center;
  background-color: @primary;
  height: 80px;
  align-items: center;
  justify-content: center;
  line-height: 80px;
  color: @white;
  border-radius: 40wx;
  opacity: 1;
}
.__ag__not_btn_text__ {
  background-color: @primary;
  opacity: 0.2;
}
.__ag__submit_tips__ {
  font-size: 13wx;
  line-height: 25wx;
  color: @red;
}
.__ag__submit_title__ {
  font-size: 13wx;
  line-height: 25wx;
}
.__ag__submit_content__ {
  margin-top: 30px;
  padding-left: 16px;
  padding-right: 16px;
}
.__ag__submit_btn__ {
  width: @fullWidth;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 34px;
  padding-left: 20wx;
  padding-right: 20wx;
  flex-direction: row;
  justify-content: space-between;
}
.__ag__btn_lf__ {
  flex: 0.48;
  height: 80px;
}
.__ag__btn_lf_text__ {
  flex: 1;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: #ededed;
  border-radius: 40wx;
}
.__ag__btn_rg__ {
  flex: 0.45;
  height: 80px;
}
.__ag__btn_rg_text__ {
  flex: 1;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: @primary;
  border-radius: 40wx;
  color: @white;
}
.__ag__model__ {
  width: @fullWidth;
  position: fixed;
  top: 136px;
  bottom: 120px;
  align-items: center;
  justify-content: center;
  background-color: @shadow;
}
.model-ipx {
  top: 175px;
}
.__ag__model_wrapper {
  width: 650px;
  padding: 16wx;
  background-color: @white;
  border-radius: 10wx;
  box-shadow: 4px 4px 8px @shadow;
}
.__ag__model_title__ {
  height: 40wx;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__feedback__ {
  color: @primaryLight;
  font-size: 25wx;
  margin-right: 10px;
}
.__ag__model_tips__ {
  font-size: 14wx;
}
.__ag__model_content__ {
  font-size: 13wx;
  line-height: 25wx;
}
.__ag__model_btn__ {
  flex-direction: row;
  justify-content: space-between;
  margin-top: 50px;
}
.__model_cannel__ {
  flex: 0.47;
  height: 40wx;
  line-height: 40wx;
  text-align: center;
  font-size: 14wx;
}
.__model_submit__ {
  flex: 0.47;
  height: 40wx;
  line-height: 40wx;
  text-align: center;
  color: @red;
  font-size: 14wx;
}
</style>
