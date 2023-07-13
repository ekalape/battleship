import WebSocket from 'ws';
import botDatabase from '../database/botDatabase';
import mainDatabase from '../database/mainDatabase';
import Player from '../utils/Player';
import { resetBotAndPlayer } from '../utils/resetPlayers';
import { winCheck, winnerResponse } from '../utils/winCheck';
import { botTurnResponse, botAttack } from '../wsHandlers/botHandler';
export const delayedResponse = (ws: WebSocket) => {
    const player = mainDatabase.get(ws) as Player
    const bot = botDatabase.find(b => b.currentGame === player?.currentGame) as Player

    player.turn = false;
    ws.send(botTurnResponse(bot))
    const botResponse = botAttack(ws);
    setTimeout(() => {
        if (botResponse) {
            ws.send(botResponse.response);
            if (botResponse.responseArray) {
                botResponse.responseArray.forEach(res => {
                    ws.send(res)
                })
            }
        }
        const winner = winCheck([player, bot])
        if (winner) {
            ws.send(winnerResponse(winner));
            resetBotAndPlayer(ws);
        }
        if (botResponse && ["killed", "shot"].includes(botResponse.hit)) delayedResponse(ws)
        else ws.send(botTurnResponse(player))
    }, 400)

}