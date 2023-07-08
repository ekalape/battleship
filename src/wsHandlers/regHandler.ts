import playerDatabase from '../database/PlayerDatabase';
import { nameValidation } from '../utils/nameValidation';
import { RegResponseType, WebSocketClient, regRequestType } from '../utils/types';


export function regHandler(index: number, data: string, ws: WebSocketClient) {
    let response: RegResponseType;

    try {
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

    }

    return response
}