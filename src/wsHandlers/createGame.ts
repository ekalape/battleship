import playerDatabase from '../database/PlayerDatabase'
import database, { findByRoom } from '../database/database';
import Player from '../utils/Player';
import { gameID } from '../utils/countID';
import { IPlayer } from '../utils/types'
import WebSocket from 'ws';

export const createGame = (player: WebSocket | undefined, gameId: number) => {
    if (!player) throw new Error(`Player not found`)

    const gameData = JSON.stringify({
        idGame: gameId,
        idPlayer: database.get(player)?.index
    })
    const response = JSON.stringify({
        type: "create_game",
        data: gameData,
        id: 0
    })
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

    return response;
}