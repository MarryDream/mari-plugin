import * as m from "./module";
import { definePlugin } from "@/modules/plugin";
import cfgList from "./commands";
import routers from "./routes";
import { Renderer } from "@/modules/renderer";
import { ExportConfig } from "@/modules/config";

export let config: ExportConfig<typeof initConfig>;
export let renderer: Renderer;
export let artifactId: m.ArtifactId;
export let enKaClass: m.EnKaClass;
export let characterId: m.CharacterId;
export let attrIcon: m.AttrIcon;

const initConfig = {
	tips: "若 enka 连接异常，可尝试更换 enKaApi 为下面的代理地址\n" +
		"原地址：https://enka.shinshin.moe/\n" +
		"代理地址A：https://enka.microgg.cn/\n" +
		"代理地址B：https://enka.minigg.cn/\n" +
		"感谢 @MiniGrayGay(Github: https://github.com/MiniGrayGay) 提供的反代服务",
	serverPort: 60721,
	uidQuery: false,
	enKaApi: "https://enka.shinshin.moe/",
	aliases: [ "茉莉" ]
};

function initModules() {
	artifactId = new m.ArtifactId();
	enKaClass = new m.EnKaClass();
	characterId = new m.CharacterId();
	attrIcon = new m.AttrIcon();
}

export default definePlugin( {
	name: "茉莉",
	cfgList,
	repo: {
		owner: "MarryDream",
		repoName: "mari-plugin",
		ref: "main"
	},
	server: {
		routers
	},
	mounted( params ) {
		/* 加载 mari-plugin.yml 配置 */
		config = params.configRegister( "main", initConfig );
		
		params.setAlias( config.aliases );
		config.on( "refresh", newCfg => {
			params.setAlias( newCfg.aliases );
		} );
		
		renderer = params.renderRegister( "#app" );
		initModules();
	}
} );