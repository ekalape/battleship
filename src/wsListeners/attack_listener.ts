import WebSocket from 'ws';
import botDatabase from '../database/botDatabase';
import mainDatabase, { findByGame } from '../database/mainDatabase';
import Player from '../utils/Player';
import { resetBotAndPlayer, resetPlayers } from '../utils/resetPlayers';
import { winCheck, winnerResponse } from '../utils/winCheck';
import { attackHandler } from '../wsHandlers/attackHandler';
import { botReceivesAttack, botTurnResponse } from '../wsHandlers/botHandler';
import { changeTurnHandler } from '../wsHandlers/changeTurnHandler';
import { delayedResponse } from './delayedResponse';

export const attack_listener = (data: string, ws: WebSocket) => {
    const { x, y, gameId, indexPlayer } = JSON.parse(data);
    const player = mainDatabase.get(ws)
    if (!player?.turn) {
        return;
    }
    if (player.singleplay) {
        const bot = botDatabase.find(b => b.currentGame === player.currentGame) as Player
        const botResponse = botReceivesAttack(data, ws)
        ws.send(botTurnResponse(bot))
        if (botResponse) {
            const { response, hit, responseArray } = botResponse;
            ws.send(response);
            if (responseArray) {
                responseArray.forEach(res => {
                    ws.send(res)
                })
            }
            const winner = winCheck([player, bot])
            if (winner) {
                ws.send(winnerResponse(winner));
                resetBotAndPlayer(ws);
            }
            if (["killed", "shot"].includes(hit)) {
                ws.send(botTurnResponse(player));
            } else {
                delayedResponse(ws)
            }
        } else {
            ws.send(botTurnResponse(player))
        }
    } else {
        const playersWs = findByGame(gameId);
        const players = playersWs.map(w => mainDatabase.get(w)) as Player[]
        let turnResponse: string;
        if (playersWs) {
            const attackResult = attackHandler({ x, y }, gameId, indexPlayer)
            if (!attackResult) {
                turnResponse = changeTurnHandler(players, false);
                ws.send(turnResponse)
                return;
            };
            const { response, hit, responseArray } = attackResult;
            if (["killed", "shot"].includes(hit)) { turnResponse = changeTurnHandler(players, false) }
            else {
                turnResponse = changeTurnHandler(players, true)
            }
            playersWs.forEach(pl => {
                pl.send(response);
            })
            if (responseArray) {
                responseArray.forEach(res => {
                    playersWs.forEach(pl => {
                        pl.send(res);
                    })
                })
            }

            playersWs.forEach(pl => {
                pl.send(turnResponse);
            })
        }
        const winner = winCheck(players)
        if (winner) {
            const winResponse = winnerResponse(winner)
            playersWs.forEach(pl => {
                pl.send(winResponse);
            });
            players.forEach(pl => resetPlayers(pl))

        }

    }
};
