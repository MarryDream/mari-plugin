export default class MariPluginConfig {
	public serverPort: number;
	public uidQuery: boolean;
	public enKaApi: string;
	
	public static init = {
		tips: "若 enka 连接异常，可尝试更换 enKaApi 为下面的代理地址\n" +
			"原地址：https://enka.shinshin.moe/\n" +
			"代理地址A：https://enka.microgg.cn/\n" +
			"代理地址B：https://enka.minigg.cn/\n" +
			"感谢 @MiniGrayGay(Github: https://github.com/MiniGrayGay) 提供的反代服务",
		serverPort: 60721,
		uidQuery: false,
		enKaApi: "https://enka.shinshin.moe/"
	};
	
	constructor( config: any ) {
		this.serverPort = config.serverPort;
		this.uidQuery = config.uidQuery;
		this.enKaApi = config.enKaApi;
	}
	
	public async refresh(): Promise<string> {
		return "mari-plugin.yml 重新加载完毕";
	}
}