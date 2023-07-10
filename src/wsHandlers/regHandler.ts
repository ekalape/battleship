import playerDatabase from '../database/PlayerDatabase';
import database, { findByIndex } from '../database/database';
import WebSocket from 'ws'
import Player from '../utils/Player';
import { nameValidation } from '../utils/nameValidation';
import { RegResponseType, WebSocketClient, regRequestType } from '../utils/types';


export function regHandler(playerName:string, playerPassword:string, ws:WebSocket) {
    let data;
  
    try{
        nameValidation(playerName, playerPassword)
        const player = new Player(playerName, playerPassword);
        database.set(ws, player)
        data = JSON.stringify({
            playerName,
            index:player.index,
            error: false,
            errorText: ""
        })

    }catch(err){

        if (err instanceof Error) {
            data = JSON.stringify({ name: "Unknown", index: -1, error: true, errorText: err.message })
        } else data = JSON.stringify({ name: "Unknown", index: -1, error: true, errorText: "Unknown error" })
    }



    const response={
        type:"reg",
        data,
        id:0
    }

return JSON.stringify(response)
}


    /*     try {
            const parsedData: regRequestType = JSON.parse(data);
            const nameIsValid = nameValidation(parsedData.name, parsedData.password)
            if (nameIsValid) {
                playerDatabase.set(parsedData.name, index, ws)
                response = { name: parsedData.name, index, error: false, errorText: "" }
            }
            else response = { name: "Unknown", index: -1, error: true, errorText: "Parsing error" }
    
        } catch (err) {
            if (err instanceof Error) {
                response = { name: "Unknown", index: -1, error: true, errorText: err.message }
            } else response = { name: "Unknown", index: -1, error: true, errorText: "Unknown error" }
    
        } */

    // return response
