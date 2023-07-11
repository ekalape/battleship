
import mainDatabase from '../database/mainDatabase';

import WebSocket from 'ws';

export const createGame = (ws: WebSocket, gameId: number) => {
    if (!ws) throw new Error(`Player not found`);

    const player = mainDatabase.get(ws)

    if (!player) throw new Error(`Player not found`)

    player.currentGame = gameId
    const gameData = JSON.stringify({
        idGame: gameId,
        idPlayer: player.index
    })
    const response = JSON.stringify({
        type: "create_game",
        data: gameData,
        id: 0
    })
    return response;



}