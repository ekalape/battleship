import playerDatabase from '../database/PlayerDatabase';
import { RegResponseType, WebSocketClient } from '../utils/types';
import WebSocket from 'ws';


export function regHandler(index: number, data: string, ws: WebSocketClient) {
    let response: RegResponseType;


    try {
        const parsedData = JSON.parse(data);
        console.log("data >> ", data)

        playerDatabase.set(parsedData.name, index, ws)
        response = { name: parsedData.name, index, error: false, errorText: "" }

    } catch (err) {
        response = { name: "Unknown", index: -1, error: true, errorText: "Parsing error" }
    }

    return response
}