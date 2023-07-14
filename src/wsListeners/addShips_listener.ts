import WebSocket from 'ws';
import mainDatabase, { findByGame } from '../database/mainDatabase';
import Player from '../utils/Player';
import { shipsToMatrix } from '../utils/shipsToMatrix';
import { AddShipsType } from '../utils/types';
import { botAddShips, botTurnResponse } from '../wsHandlers/botHandler';
import { changeTurnHandler } from '../wsHandlers/changeTurnHandler';
import { startGame } from '../wsHandlers/startGame';

export const addShips_listener = (data: string, ws: WebSocket) => {
    const startingData: AddShipsType = JSON.parse(data)
    const actualPlayer = mainDatabase.get(ws)
    if (actualPlayer?.singleplay) {
        const botResponse = botAddShips(startingData, ws)
        const turnResponse = botTurnResponse(actualPlayer)
        if (botResponse) { ws.send(botResponse); }
        ws.send(turnResponse);
    } else {
        const playersWs = findByGame(startingData.gameId);
        const players = playersWs.map(w => mainDatabase.get(w)) as Player[]
        if (actualPlayer) {
            actualPlayer.ships = startingData.ships;
            actualPlayer.matrix = shipsToMatrix(startingData.ships)
        }

        if (players.every(pl => pl?.ships && pl?.ships.length > 0)) {
            const startResponse0 = startGame(players[0] as Player);
            const startResponse1 = startGame(players[1] as Player);
            if (startResponse0 && startResponse1) {

                playersWs[0].send(startResponse0);
                playersWs[1].send(startResponse1);
            }
        }

        const turnResponse = changeTurnHandler(players, true)
        playersWs.forEach(w => w.send(turnResponse))
    }
};
