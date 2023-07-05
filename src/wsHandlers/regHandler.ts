import playerDatabase from '../database/PlayerDatabase';
import { regResponse } from '../utils/types';

export function regHandler(data: string) {
    let response: regResponse;

    try {
        const parsedData = JSON.parse(data);
        console.log("data >> ", data)
        const index = playerDatabase.getNextNumber()
        playerDatabase.set(parsedData.name, index)
        response = { name: parsedData.name, index, error: false, errorText: "" }

    } catch (err) {
        response = { name: "Unknown", index: -1, error: true, errorText: "Parsing error" }
    }
    return JSON.stringify(response)
}