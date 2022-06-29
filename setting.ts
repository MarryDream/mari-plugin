import { OrderConfig } from "@modules/command";
import { PluginSetting } from "@modules/plugin";

const panelDetail: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.panel",
	desc: [ "角色详情", "(UID|@)[角色]" ],
	headers: [ "panel" ],
	regexps: [
		[ "(\\d{9})?", "[\\u4e00-\\u9fa5]+" ],
		[ "\\[CQ:at,qq=\\d+.*]?", "[\\u4e00-\\u9fa5]+" ]
	],
	main: "achieves/chara/detail",
	detail: "展示看板角色详情，游戏中将角色放入看板并打开\"显示详细信息\"才可查询"
};

const panelUpdate: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.panel-update",
	desc: [ "更新详情", "(UID|@|-c)" ],
	headers: [ "panel_update" ],
	regexps: [
		[ "(\\d{9})?" ],
		[ "\\[CQ:at,qq=\\d+.*]?" ],
		[ "-c" ]
	],
	main: "achieves/chara/update",
	detail: "更新并存储面板详情，游戏中将角色放入看板并打开\"显示详细信息\"才可获取\n" +
			"使用 -c 清空存储的面板数据"
};

const events: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.events-calendar",
	desc: [ "活动日历", "" ],
	headers: [ "event" ],
	regexps: [ "" ],
	main: "achieves/event",
	detail: "原神活动持续时间日历"
};

export default <PluginSetting>{
	pluginName: "mari-plugin",
	cfgList: [ panelDetail, panelUpdate, events ]
};