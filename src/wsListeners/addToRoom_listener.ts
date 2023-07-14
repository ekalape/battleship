import WebSocket from 'ws';
import mainDatabase, { findByRoom } from '../database/mainDatabase';
import { gameID } from '../utils/countID';
import wss from '../webSocket_server';
import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';
import { createGame } from '../wsHandlers/createGame';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';


export const addToRoom_listener = async (data: string, ws: WebSocket) => {
    const playerData: { indexRoom: number } = JSON.parse(data);
    const player = mainDatabase.get(ws)
    if (player) {
        await addPlayerToRoom(player, playerData.indexRoom);

        const players = findByRoom(playerData.indexRoom);
        if (players.length === 2) {
            const gameId = gameID()

            players[0].send(createGame(players[0], gameId))
            players[1].send(createGame(players[1], gameId))
        }
        wss.clients.forEach(async pl => {
            pl.send(await updateRoomStatus())
        })
    }
};
