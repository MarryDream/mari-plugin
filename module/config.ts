import { RefreshCatch } from "@modules/management/refresh";
import { configFileName } from "#mari-plugin/init";
import { PluginAlias } from "@modules/plugin";

export interface IMariPluginConfig {
	tips: string;
	serverPort: number;
	uidQuery: boolean;
	enKaApi: string;
	openAiKey: string;
	aliases: string[];
}

export default class MariPluginConfig {
	public serverPort: number;
	public uidQuery: boolean;
	public enKaApi: string;
	public openAiKey: string;
	public aliases: string[];
	
	public static init: IMariPluginConfig = {
		tips: "若 enka 连接异常，可尝试更换 enKaApi 为下面的代理地址\n" +
			"原地址：https://enka.shinshin.moe/\n" +
			"代理地址A：https://enka.microgg.cn/\n" +
			"代理地址B：https://enka.minigg.cn/\n" +
			"感谢 @MiniGrayGay(Github: https://github.com/MiniGrayGay) 提供的反代服务",
		serverPort: 60721,
		uidQuery: false,
		enKaApi: "https://enka.shinshin.moe/",
		openAiKey: "",
		aliases: [ "茉莉" ]
	};
	
	constructor( config: IMariPluginConfig ) {
		this.serverPort = config.serverPort;
		this.uidQuery = config.uidQuery;
		this.enKaApi = config.enKaApi;
		this.aliases = config.aliases;
		this.openAiKey = config.openAiKey;
	}
	
	public async refresh( config: IMariPluginConfig ): Promise<string> {
		try {
			this.uidQuery = config.uidQuery;
			this.enKaApi = config.enKaApi;
			this.openAiKey = config.openAiKey;
			
			for ( const alias of this.aliases ) {
				Reflect.deleteProperty( PluginAlias, alias );
			}
			this.aliases = config.aliases;
			for ( const alias of this.aliases ) {
				Reflect.set( PluginAlias, alias, "mari-plugin" );
			}
			
			return `${ configFileName }.yml 重新加载完毕`;
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: `${ configFileName }.yml 重新加载失败，请前往控制台查看日志`
			};
		}
	}
}