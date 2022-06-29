// https://github.com/NepPure/calendar.neptunia.vip @NepPure
import { InputParameter } from "@modules/command";
import { RenderResult } from "@modules/renderer";
import { renderer } from "#mari-plugin/init";
import puppeteer from "puppeteer";

function asCqCode( base64Str: string ): string {
	const base64: string = `base64://${ base64Str }`;
	return `[CQ:image,file=${ base64 }]`;
}

async function screenShot( page: puppeteer.Page ): Promise<string> {
	const option: puppeteer.ScreenshotOptions = { encoding: "base64" };
	const element = await page.$( "#app .calendar-wapper" );
	const result = <string>await element?.screenshot( option );
	return asCqCode( result );
}

export async function main( { sendMessage, logger }: InputParameter ): Promise<void> {
	const res: RenderResult = await renderer.asForFunction(
		"https://calendar.neptunia.vip/ys/index.html", screenShot );
	if ( res.code === "ok" ) {
		await sendMessage( res.data );
	} else {
		logger.error( res.error );
		await sendMessage( "图片渲染异常，请联系持有者进行反馈" );
	}
}