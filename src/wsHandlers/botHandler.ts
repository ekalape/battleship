import WebSocket from 'ws'
import mainDatabase from '../database/mainDatabase'
import singleplayDatabase from '../database/singleplayDatabase'
import { gameID, roomCount } from '../utils/countID'
import { addPlayerToRoom } from './addPlayerToRoom'
import Player from '../utils/Player'
import { createGame } from './createGame'

export const botHandler = (playerWs: WebSocket) => {
    const player = mainDatabase.get(playerWs) as Player

    /*   singleplayDatabase.set(playerWs, player);
      mainDatabase.delete(playerWs);
*/
    player.singleplay = true;
    let roomId = player.room
    if (!roomId) {
        roomId = roomCount();
        addPlayerToRoom(player, roomId)
    }
    const bot = new Player("Bot", "noPassword");
    addPlayerToRoom(bot, roomId);
    const gameId = gameID()
    const playerGameResponse = createGame(playerWs, gameId)
    bot.currentGame = gameId;
    return playerGameResponse;


}

export const botCommands = (type: string, data: string) => {
    console.log(`bot type: ${type}`)
    switch (type) {
        case "add_ships":

            break;

        case "attack":

            break;

        case "randomAttack":

            break;

        default: { console.log(`bot data: ${data}`) }
    }

}