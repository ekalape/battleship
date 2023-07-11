
import database from '../database/database';
import WebSocket from 'ws'
import Player from '../utils/Player';
import { nameValidation } from '../utils/nameValidation';
import { IMessage } from '../utils/types';


export function regHandler(playerName: string, playerPassword: string, ws: WebSocket) {
    let data;

    try {
        nameValidation(playerName, playerPassword)
        const player = new Player(playerName, playerPassword);
        database.set(ws, player)
        data = JSON.stringify({
            playerName,
            index: player.index,
            error: false,
            errorText: ""
        })

    } catch (err) {

        if (err instanceof Error) {
            data = JSON.stringify({ name: "Unknown", index: -1, error: true, errorText: err.message })
        } else data = JSON.stringify({ name: "Unknown", index: -1, error: true, errorText: "Unknown error" })
    }


    const response: IMessage = {
        type: "reg",
        data,
        id: 0
    }

    return JSON.stringify(response)
}

