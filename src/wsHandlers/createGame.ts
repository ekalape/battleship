import playerDatabase from '../database/PlayerDatabase'
import database, { findByRoom } from '../database/database';
import Player from '../utils/Player';
import { gameID } from '../utils/countID';
import { IPlayer } from '../utils/types'
import WebSocket from 'ws';

export const createGame = (ws: WebSocket | undefined, gameId: number) => {
    if (!ws) throw new Error(`Player not found`);

    const player = database.get(ws)

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



    /*     playerDatabase.getSinglePlayer(opponent.index).currentGame = gameId;
        const gameData = JSON.stringify({
            idGame: gameId,
            idPlayer: opponent.index
        })
        const response = JSON.stringify({
            type: "create_game",
            data: gameData,
            id: 0
        }) */


}