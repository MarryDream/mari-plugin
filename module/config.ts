export default class MariPluginConfig {
	public serverPort: number;
	
	public static init = {
		serverPort: 60721
	};
	
	constructor( config: any ) {
		this.serverPort = config.serverPort;
	}
	
	public async refresh(): Promise<string> {
		return "mari-plugin.yml 重新加载完毕";
	}
}