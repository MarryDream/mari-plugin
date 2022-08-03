import { OrderConfig } from "@modules/command";
import { PluginSetting } from "@modules/plugin";
import { AuthLevel } from "@modules/management/auth";

const panelDetail: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.panel",
	desc: [ "详情", "(UID|@)[角色]" ],
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

const upgrade: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.hot-upgrade",
	desc: [ "更新茉莉", "(-f)" ],
	headers: [ "mari_upgrade" ],
	regexps: [ "(-f)?" ],
	auth: AuthLevel.Master,
	main: "achieves/upgrade",
	detail: "该指令用于检测并更新茉莉源码\n" +
		"要求项目必须是通过 git clone 下载的且不能为 win-start 启动\n" +
		"若存在更新则会更新并重启 bot\n" +
		"在指令后追加 -f 来覆盖本地修改强制更新"
}

export default <PluginSetting>{
	pluginName: "mari-plugin",
	cfgList: [ panelDetail, panelUpdate, upgrade ],
	repo: {
		owner: "MarryDream",
		repoName: "mari-plugin",
		ref: "master"
	}
};