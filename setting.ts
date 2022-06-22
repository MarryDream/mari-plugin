import { OrderConfig } from "@modules/command";
import { PluginSetting } from "@modules/plugin";

const charaDetail: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.panel-detail",
	desc: [ "角色详情", "[角色]" ],
	headers: [ "panel_detail" ],
	regexps: [ "[\\w\\u4e00-\\u9fa5]+" ],
	main: "achieves/chara/detail",
	detail: "展示看板角色详情，游戏中将角色放入看板并打开\"显示详细信息\"才可查询"
};

const charaUpdate: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.panel-update",
	desc: [ "更新面板", "" ],
	headers: [ "panel_update" ],
	regexps: [],
	main: "achieves/chara/update",
	detail: "更新并存储面板详情，游戏中将角色放入看板并打开\"显示详细信息\"才可获取"
};

export default <PluginSetting>{
	pluginName: "mari-plugin",
	cfgList: [ charaDetail, charaUpdate ]
};