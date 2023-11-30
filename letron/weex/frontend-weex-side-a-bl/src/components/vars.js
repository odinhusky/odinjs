import country from './country.js'
import env from './env.js'
const vars = {}

vars.version = env.version

vars.day = [
	'周日',
	'周一',
	'周二',
	'周三',
	'周四',
	'周五',
	'周六',
]

vars.tops = [
	'60px',
	'80px',
	'100px',
	'120px',
	'140px',
	'160px',
	'180px',
]
//进入直播间/群组
vars.TYPE_ENTER = 1;
//离开直播间/群组
vars.TYPE_LEAVE = -1;
//游客进入直播间/群组
vars.TYPE_ENTER_GUEST = 2;
//游客离开直播间/群组
vars.TYPE_LEAVE_GUEST = -2;
//订阅
vars.TYPE_FOLLOW = 3;
//取消订阅
vars.TYPE_FOLLOW_CANCEL = -3;
//文本消息
vars.TYPE_NORMAL = 4;
//公告
vars.TYPE_NOTICE = 5;
//系统公告
vars.TYPE_SYS_NOTICE = 6;
//弹幕
vars.TYPE_DANMU = 7;
//直播/直播间配置更新
vars.TYPE_LIVE_UPDATE = 8;
//投票
vars.TYPE_VOTE = 9;
//投票结果
vars.TYPE_VOTE_RESULT = -9;
//用户投票
vars.TYPE_VOTE_USER = 10;
// 删除
vars.TYPE_REMOVE_MESSAGE = 11;
// 添加好友
vars.TYPE_ADD_FRIEND = 12;

//领取礼物
vars.TYPE_GIFT = 13;
//绑定
vars.TYPE_BANG = 14;
vars.country = []

let countrys = []

for(let i in country){
	let r = country[i]
	let id = r[3]
	let name = r[1]
	let key= JSON.stringify(r).toLowerCase()
	// vars.country.push({id, name, key})
	countrys.push({id, name, key})
}

vars.country = countrys.sort((a,b)=>{
	return a.name.localeCompare(b.name, 'zh-CN');
})

vars.country1 = ['菲律宾','中国大陆','香港','泰国','澳门','马来西亚','新加坡','台湾省','越南']

vars.country2 = {'0': 63,'1': 86,'2': 852,'3': 66,'4': 853,'5': 60,'6': 65,'7': 886,'8': 84}

vars.status = ["未开始", "已开始", "已结束", "已取消", "待定", "中断", "已推迟", "腰斩"]
vars.statusMap={}

for(let i in vars.status){
	let r = vars.status[i]
	vars.statusMap[i] = r
}
export default vars