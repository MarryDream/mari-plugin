import { OrderConfig } from "@modules/command";
import { PluginSetting } from "@modules/plugin";

const charaDetail: OrderConfig = {
	type: "order",
	cmdKey: "marry-dream.chara-detail",
	desc: [ "角色详情", "[角色]" ],
	headers: [ "chara_detail" ],
	regexps: [ "[\\w\\u4e00-\\u9fa5]+" ],
	main: "achieves/chara/detail",
	detail: "展示看板角色详情，游戏中将角色放入看板并打开\"显示详细信息\"才可查询"
};

export default <PluginSetting>{
	pluginName: "mari-plugin",
	cfgList: [ charaDetail ]
};