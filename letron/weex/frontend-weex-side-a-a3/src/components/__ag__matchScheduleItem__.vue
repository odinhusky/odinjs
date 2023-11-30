<template>
  <div
    class="__ag__match-schedule-item__"
    v-if="a__ag__dateItem__ && a__ag__dateItem__.id"
  >
    <div v-if="!a__ag__dateItem__.lives" class="__ag__item__">
      <div class="__ag__item-top__">
        <div class="__ag__match-status__"></div>
        <div class="__ag__match-time__">
          <text class="__ag__lives-name-text__">{{
            (a__ag__dateItem__ &&
              a__ag__dateItem__.joinMap &&
              a__ag__dateItem__.joinMap.match &&
              a__ag__dateItem__.joinMap.match.nameAbbr) ||
            a__ag__dateItem__.matchName
          }}</text>
          <text class="__ag__lives-begin__">{{
            a__ag__util__.formatTime(a__ag__dateItem__.beginTime)
          }}</text>
        </div>
        <div class="__ag__match-status__">
          <text
            class="__ag__status-text__"
            :class="[
              a__ag__dateItem__.status == 0 ? '__ag__status-started__' : '',
            ]"
            >{{ a__ag__var__.status[a__ag__dateItem__.status] }}</text
          >
        </div>
      </div>
      <div class="__ag__item-center__">
        <div class="__ag__match-team-a-text__">
          <!-- type: {{ typeof a__ag__dateItem__.teamFlaga }}
          <br />
          value: {{ a__ag__dateItem__.teamFlaga }} -->

          <!-- 隊伍 A 的圖片 -->
          <image
            class="__ag__match-team-a-image__"
            v-if="a__ag__dateItem__.teamFlaga"
            mode="aspectFit"
            :src="__ag__url__(a__ag__dateItem__.teamFlaga)"
          ></image>

          <!-- <text v-else class="__ag__assembly-char__">{{
            a__ag__dateItem__.teamNamea && a__ag__dateItem__.teamNamea.charAt(0)
          }}</text> -->

          <!-- 隊伍首字母 -->
          <team-capital-circle
            v-else
            :size="112"
            team="a"
            :capital="a__ag__dateItem__.teamNamea.charAt(0)"
          />

          <text class="__ag__match-team-teamName__">{{
            a__ag__dateItem__.teamNamea
          }}</text>
        </div>
        <div class="__ag__item_score__">
          <div class="__score_box__" v-if="a__ag__dateItem__.status != 0">
            <text
              class="__ag__score__"
              :class="[
                a__ag__dateItem__.status != 0 &&
                a__ag__dateItem__.scorea < a__ag__dateItem__.scoreb
                  ? '__ag__black__'
                  : a__ag__dateItem__.status != 0 &&
                    a__ag__dateItem__.scorea > a__ag__dateItem__.scoreb
                  ? '__ag__red__'
                  : '',
              ]"
              >{{
                a__ag__dateItem__.status == 0 ? "-" : a__ag__dateItem__.scorea
              }}</text
            >
            <text class="__ag__scorea-line__">:</text>
            <text
              class="__ag__score__"
              :class="[
                a__ag__dateItem__.status != 0 &&
                a__ag__dateItem__.scorea > a__ag__dateItem__.scoreb
                  ? '__ag__black__'
                  : a__ag__dateItem__.status != 0 &&
                    a__ag__dateItem__.scorea < a__ag__dateItem__.scoreb
                  ? '__ag__red__'
                  : '',
              ]"
              >{{
                a__ag__dateItem__.status == 0 ? "-" : a__ag__dateItem__.scoreb
              }}</text
            >
          </div>
          <text class="__score_tips__" v-else>VS</text>
        </div>
        <div class="__ag__match-team-a-text__">
          <!-- type: {{ typeof a__ag__dateItem__.teamFlagb }}
          <br />
          value: {{ a__ag__dateItem__.teamFlagb }} -->
          <!-- 隊伍 B 的圖片 -->
          <image
            class="__ag__match-team-a-image__"
            v-if="a__ag__dateItem__.teamFlagb"
            mode="aspectFit"
            :src="__ag__url__(a__ag__dateItem__.teamFlagb)"
          ></image>

          <!-- <text v-else class="__ag__assembly-char__">{{
            a__ag__dateItem__.teamNameb && a__ag__dateItem__.teamNameb.charAt(0)
          }}</text> -->

          <!-- 隊伍首字母 -->
          <team-capital-circle
            v-else
            :size="112"
            team="b"
            :capital="a__ag__dateItem__.teamNameb.charAt(0)"
          />

          <text class="__ag__match-team-teamName__">{{
            a__ag__dateItem__.teamNameb
          }}</text>
        </div>
      </div>
    </div>
    <div v-else class="__ag__item-lives__">
      <div class="__ag__item-lives-top__">
        <div class="__ag__match-status__"></div>
        <div class="__ag__match-time__">
          <text class="__ag__lives-name-text__">{{
            (a__ag__dateItem__ &&
              a__ag__dateItem__.joinMap &&
              a__ag__dateItem__.joinMap.match &&
              a__ag__dateItem__.joinMap.match.nameAbbr) ||
            a__ag__dateItem__.matchName
          }}</text>
          <text class="__ag__lives-begin__">{{
            a__ag__util__.formatTime(a__ag__dateItem__.beginTime)
          }}</text>
        </div>
        <div class="__ag__match-status__">
          <template
            v-if="
              a__ag__dateItem__.islive === 1 &&
              a__ag__dateItem__.lives &&
              a__ag__dateItem__.lives.length > 0
            "
          >
            <div class="__ag__video-online-yuan__"></div>
            <text class="__ag__lives-status-text__" style="padding-left: 7px"
              >直播中</text
            >
          </template>

          <text
            v-else
            class="__ag__lives-status-text__"
            :class="[
              a__ag__dateItem__.status == 0 ? '__ag__status-started__' : '',
            ]"
            >{{ a__ag__var__.status[a__ag__dateItem__.status] }}</text
          >
        </div>
      </div>
      <div class="__ag__item-lives-center__">
        <div class="__ag__item-lives-info__">
          <!-- 隊伍 A 的圖片 -->

          <image
            class="__ag__lives-team-a-image__"
            v-if="a__ag__dateItem__.teamFlaga"
            mode="aspectFit"
            :src="__ag__url__(a__ag__dateItem__.teamFlaga)"
          ></image>

          <!-- <text v-else class="__ag__assembly-char__">{{
            a__ag__dateItem__.teamNamea && a__ag__dateItem__.teamNamea.charAt(0)
          }}</text> -->

          <!-- 隊伍首字母 -->
          <team-capital-circle
            v-else
            :size="112"
            team="a"
            :capital="a__ag__dateItem__.teamNamea.charAt(0)"
          />

          <text class="__ag__lives-team-teamName__">{{
            a__ag__dateItem__.teamNamea
          }}</text>
        </div>
        <div class="__ag__item-lives-info-center__">
          <div class="__score_box__" v-if="a__ag__dateItem__.status != 0">
            <text
              class="__ag__score__"
              :class="[
                a__ag__dateItem__.status != 0 &&
                a__ag__dateItem__.scorea < a__ag__dateItem__.scoreb
                  ? '__ag__black__'
                  : a__ag__dateItem__.status != 0 &&
                    a__ag__dateItem__.scorea > a__ag__dateItem__.scoreb
                  ? '__ag__red__'
                  : '',
              ]"
              >{{
                a__ag__dateItem__.status == 0 ? "-" : a__ag__dateItem__.scorea
              }}</text
            >
            <text class="__ag__scorea-line__">:</text>
            <text
              class="__ag__score__"
              :class="[
                a__ag__dateItem__.status != 0 &&
                a__ag__dateItem__.scorea > a__ag__dateItem__.scoreb
                  ? '__ag__black__'
                  : a__ag__dateItem__.status != 0 &&
                    a__ag__dateItem__.scorea < a__ag__dateItem__.scoreb
                  ? '__ag__red__'
                  : '',
              ]"
              >{{
                a__ag__dateItem__.status == 0 ? "-" : a__ag__dateItem__.scoreb
              }}</text
            >
          </div>
          <text class="__score_tips__" v-else>VS</text>
        </div>
        <div class="__ag__item-lives-info__">
          <!-- 隊伍 B 的圖片 -->
          <image
            class="__ag__lives-team-a-image__"
            v-if="a__ag__dateItem__.teamFlagb"
            mode="aspectFit"
            :src="__ag__url__(a__ag__dateItem__.teamFlagb)"
          ></image>

          <!-- <text v-else class="__ag__assembly-char__">{{
            a__ag__dateItem__.teamNameb && a__ag__dateItem__.teamNameb.charAt(0)
          }}</text> -->

          <!-- 隊伍首字母 -->
          <team-capital-circle
            v-else
            :size="112"
            team="b"
            :capital="a__ag__dateItem__.teamNameb.charAt(0)"
          />

          <text class="__ag__lives-team-teamName__">{{
            a__ag__dateItem__.teamNameb
          }}</text>
        </div>
      </div>
      <div class="__ag__item-lives-users__">
        <!-- <scroller scroll-direction="horizontal" :show-scrollbar="false" class="__ag__lives_scroll__" >
					<div class="__ag__schedule-user__" v-for="(li,index) in a__ag__dateItem__.lives" :key="li.id"  @click.stop="__ag__toLisve__(li)" :class="[isMultiple(index)?'__ag__schedule-multiple__':'']">
						<div class="__ag__avatar_item__">
							<image resize="contain" v-if="li.avatar" class="__ag__avatar__" :src="__ag__url__(li.avatar)"></image>
							<div v-else class="__ag__avatar__">
								<text class="__ag__friend-ava__">{{li && li.joinMap && li.joinMap.user && li.joinMap.user.userNicename && li.joinMap.user.userNicename && li.joinMap.user.userNicename.charAt(0)}}</text>
							</div>
						</div>
						<div class="__ag__schedule-user-rg__">
							<text class="__ag__schedule-user-text__">{{li.upName}}</text>
							<div class="__ag__schedule_dy__">
								<image class="__ag__lives_dy_image__" resize="contain" :src="__ag__url__('/static/a3/5l5-dy2.png')"></image>
								<text class="__ag__schedule_amout__">{{score1(li)}}</text>
							</div>
						</div>
					</div>
				</scroller> -->
        <div
          class="__ag__schedule-user__"
          v-for="(li, index) in a__ag__dateItem__.lives"
          :key="li.id"
          @click.stop="__ag__toLisve__(li)"
          :class="[isMultiple(index) ? '__ag__schedule-multiple__' : '']"
        >
          <div class="__ag__schedule_item__">
            <div
              :class="[
                li.fromListRequestSchedule ? 'garyBorder' : 'orangeBorder',
                '__ag__matchupimgdiv__',
              ]"
            >
              <image
                resize="contain"
                v-if="li.avatar"
                class="__ag__matchupimg__"
                :src="__ag__url__(li.avatar)"
              ></image>
              <div v-else class="__ag__matchupimg__">
                <text class="__ag__friend-ava__">{{
                  li &&
                  li.joinMap &&
                  li.joinMap.user &&
                  li.joinMap.user.userNicename &&
                  li.joinMap.user.userNicename &&
                  li.joinMap.user.userNicename.charAt(0)
                }}</text>
              </div>
            </div>
            <text
              v-if="!li.fromListRequestSchedule"
              class="__ag__matchupimgtext__"
              >直播中</text
            >
          </div>
          <text class="__ag__schedule-user-text__">{{
            li.joinMap.user.userNicename || li.upName
          }}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import a__ag__util__ from "./util.js"
import a__ag__var__ from "./vars.js"
import agMinix from "./__ag__minix__.js"
import agMinUrl from "./__ag__minurl__.js"

import teamCapitalCircle from "@/components/team-capital-circle.vue"

export default {
  mixins: [agMinix, agMinUrl], // 使用mixin
  props: {
    dateItem: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  components: {
    "team-capital-circle": teamCapitalCircle,
  },
  data() {
    return {
      a__ag__util__,
      a__ag__var__,
      a__ag__dateItem__: {},
      columnGap: 1,
      // showA1Img: true,
      // showB1Img: true,
      // showA2Img: true,
      // showB2Img: true,
    }
  },
  watch: {
    dateItem(i) {
      if (
        i.lives.length > 0 &&
        i.lives[0].joinMap.user.userNicename === "L測試中"
      ) {
        console.log("@@ dateItem i=>", JSON.stringify(i))
      }
      this.a__ag__dateItem__ = i
    },
  },
  mounted() {
    this.a__ag__dateItem__ = this.dateItem
  },
  methods: {
    // 避免load不到圖片空掉的狀況
    // loadA1Img(event) {
    //   if (event.success === 0) this.showA1Img = false
    // },
    // loadB1Img(event) {
    //   if (event.success === 0) this.showB1Img = false
    // },
    // loadA2Img(event) {
    //   if (event.success === 0) this.showA2Img = false
    // },
    // loadB2Img(event) {
    //   if (event.success === 0) this.showB2Img = false
    // },
    score1(item) {
      let amount = item.joinMap && item.joinMap.room && item.joinMap.room.amount
      return a__ag__util__.numberReadable(amount)
    },
    isMultiple(i) {
      let index = i + 1
      if (index % 3 === 0) {
        return true
      } else {
        return false
      }
    },
    __ag__toLisve__(li) {
      if (!li.uid) {
        return
      }
      if (typeof li.uid == "string") {
        li.uid = li.uid.split(",")[0]
      }
      this.__ag__itemtap__(li.uid, false)
    },
  },
}
</script>

<style lang="less" scoped>
@import "../style/default.less";
.__ag__match-schedule-item__ {
  width: 750px;
  background-color: @white;
  padding-top: 12wx;
  padding-bottom: 12wx;
  margin-bottom: 10wx;
}
.__ag__item__ {
  flex: 1;
  padding-left: 12wx;
  padding-right: 12wx;
}
.__ag__item-top__ {
  height: 30wx;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10wx;
}
.__ag__match-begin__ {
  font-size: 14wx;
  color: @black;
}
.__ag__match-name-text__ {
  font-size: 13wx;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.5);
}
.__ag__item-center__ {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5wx;
}
.__ag__match-team-a-text__ {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__match-team-a-image__ {
  width: 112px;
  height: 112px;
  border-radius: 50wx;
}
.__ag__assembly-char__ {
  width: 112px;
  height: 112px;
  line-height: 112px;
  border-radius: 50wx;
  text-align: center;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  background-color: #efefef;
  font-size: 17wx;
}
.__ag__match-team-teamName__ {
  flex: 1;
  font-weight: 500;
  font-size: 15wx;
  letter-spacing: 0.05em;
  color: @black;
  text-overflow: ellipsis;
  text-align: center;
  lines: 1;
  margin-top: 16px;
}
.__ag__item_score__ {
  display: flex;
  flex-direction: row;
  margin-left: 10wx;
  margin-right: 10wx;
  align-items: center;
  justify-content: center;
}
.__score_box__ {
  flex-direction: row;
  justify-content: center;
}
.__score_tips__ {
  flex: 0.3;
  text-align: center;
  font-size: 28px;
  font-style: normal;
  font-weight: 400;
  padding-left: 10px;
  padding-right: 10px;
}
.__ag__status-text__ {
  font-size: 10wx;
  color: #2b2b2b;
}
.__ag__status-started__ {
  color: rgba(0, 0, 0, 1);
}
.__ag__score__ {
  color: rgba(0, 0, 0, 0.4);
  font-weight: 500;
  font-size: 18wx;
}
.__ag__black__ {
  color: @black;
}
.__ag__red__ {
  color: @red;
}
.__ag__item-lives__ {
  padding-left: 12wx;
  padding-right: 12wx;
}
.__ag__item-lives-top__ {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10wx;
  padding-right: 10px;
}
.__ag__match-name__,
.__ag__match-time__ {
  flex: 1;
  height: 30wx;
  line-height: 30wx;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.__ag__match-status__ {
  flex: 0.6;
  height: 30wx;
  line-height: 30wx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.__ag__lives-name-text__ {
  font-size: 14wx;
  letter-spacing: 0.05em;
  color: #9c9c9c;
  height: 30wx;
  line-height: 30wx;
  margin-right: 10px;
}
.__ag__lives-begin__ {
  text-align: center;
  font-size: 14wx;
  letter-spacing: 0.05em;
  color: #9c9c9c;
  height: 30wx;
  line-height: 30wx;
}
.__ag__video-online-yuan__ {
  width: 10wx;
  height: 10wx;
  border-radius: 50%;
  background-color: @red;
}
.__ag__lives-status-text__ {
  font-size: 10wx;
  letter-spacing: 0.05em;
  color: @black;
}
.__ag__item-lives-center__ {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.__ag__item-lives-info__ {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.__ag__item-lives-info-center__ {
  display: flex;
  flex-direction: row;
  margin-left: 10wx;
  margin-right: 10wx;
  align-items: center;
  justify-content: center;
}
.__ag__lives-team-teamName__ {
  flex: 1;
  font-weight: 500;
  font-size: 15wx;
  letter-spacing: 0.05em;
  color: @black;
  text-overflow: ellipsis;
  text-align: center;
  lines: 1;
  margin-top: 16px;
}
.__ag__lives-team-a-image__ {
  width: 112px;
  height: 112px;
  border-radius: 50wx;
}
.__ag__scorea-line__ {
  width: 10wx;
  margin-left: 2wx;
  margin-right: 2wx;
  text-align: center;
}
.__ag__item-lives-users__ {
  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 10wx;
}
.__ag__schedule-user__ {
  width: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10wx;
  margin-right: 10wx;
}
.__ag__schedule-multiple__ {
  margin-right: 0px;
}
.__ag__schedule_item__ {
  width: 110px;
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.__ag__matchupimgdiv__ {
  width: 96px;
  height: 96px;
  justify-content: center;
  align-items: center;
  border-style: solid;
  border-width: 2wx;
  border-radius: 50wx;
}
.orangeBorder {
  border-color: #fdc501;
}
.garyBorder {
  border-color: @border;
}
.__ag__matchupimg__ {
  width: 80px;
  height: 80px;
  border-radius: 50wx;
  align-items: center;
  justify-content: center;
}
.__ag__friend-ava__ {
  color: rgba(0, 0, 0, 0.3);
  font-size: 20wx;
}
.__ag__matchupimgtext__ {
  position: absolute;
  bottom: -4px;
  padding: 4px;
  border-radius: 20px;
  padding-left: 8px;
  padding-right: 8px;
  font-style: normal;
  font-weight: 500;
  font-size: 6wx;
  color: @white;
  background-color: @primary;
}
.__ag__schedule-user-text__ {
  flex: 1;
  font-size: 10wx;
  font-weight: 400;
  text-align: center;
  color: @black;
  text-overflow: ellipsis;
  lines: 1;
  margin-top: 10px;
}
</style>
