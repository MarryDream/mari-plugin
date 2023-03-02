import { OrderConfig } from "@modules/command";
import { PluginSetting } from "@modules/plugin";
import { AuthLevel } from "@modules/management/auth";
import MariPluginConfig from "#mari-plugin/module/config";

const panelDetail: OrderConfig = {
	type: "order",
	cmdKey: "seto-mari.panel",
	desc: [ "详情", "[角色](UID|@)" ],
	headers: [ "panel" ],
	regexps: [
		[ "[\\u4e00-\\u9fa5]+", "(\\d{9})?" ],
		[ "[\\u4e00-\\u9fa5]+", "\\[CQ:at,type=at,qq=\\d+.*]?" ]
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
		[ "\\[CQ:at,type=at,qq=\\d+.*]?" ],
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

const chat: OrderConfig = {
	type: "order",
	cmdKey: "marry-dream.chat",
	desc: [ "chatGPT", "" ],
	headers: [ "chat" ],
	regexps: [ ".+" ],
	main: "achieves/chat",
	detail: "chatGPT 聊天"
};

export default ( config: MariPluginConfig ): PluginSetting => {
	return {
		pluginName: "mari-plugin",
		cfgList: [ panelDetail, panelUpdate, upgrade, chat ],
		aliases: config.aliases,
		repo: {
			owner: "MarryDream",
			repoName: "mari-plugin",
			ref: "master"
		}
	}
}