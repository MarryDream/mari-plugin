export default class MariPluginConfig {
	public serverPort: number;
	public uidQuery: boolean;
	
	public static init = {
		serverPort: 60721,
		uidQuery: false
	};
	
	constructor( config: any ) {
		this.serverPort = config.serverPort;
		this.uidQuery = config.uidQuery;
	}
	
	public async refresh(): Promise<string> {
		return "mari-plugin.yml 重新加载完毕";
	}
}