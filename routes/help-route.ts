import bot from "ROOT";
import express from "express";

export default express.Router().get( "/", async ( req, res ) => {
	const data = await bot.redis.getString( "mari-plugin.help-data" );
	res.send( JSON.parse( data ) );
} )