import WebSocket from 'ws'
import mainDatabase from '../database/mainDatabase'
import { gameID, roomCount } from '../utils/countID'
import { addPlayerToRoom } from './addPlayerToRoom'
import Player from '../utils/Player'
import { createGame } from './createGame'
import { AddShipsType, botFullResponse } from '../utils/types'
import { shipsToMatrix } from '../utils/shipsToMatrix'
import botDatabase from '../database/botDatabase'
import { botShipsPositions } from '../utils/botShipsPositions'
import { startGame } from './startGame'
import { attackCheck, attackHandler, attackResponse } from './attackHandler'
import { botRandomAttack } from './randomAttackHandler'

export const botHandler = (playerWs: WebSocket) => {
    const player = mainDatabase.get(playerWs) as Player
    player.singleplay = true;
    let roomId = player.room
    if (!roomId) {
        roomId = roomCount();
        addPlayerToRoom(player, roomId)
    }
    const bot = new Player("Bot", "noPassword");
    botDatabase.push(bot)
    addPlayerToRoom(bot, roomId);
    const gameId = gameID()
    const playerGameResponse = createGame(playerWs, gameId)
    bot.currentGame = gameId;
    return playerGameResponse;


}

export const botAddShips = (data: AddShipsType, ws: WebSocket) => {
    const player = mainDatabase.get(ws)
    const bot = botDatabase.find(b => b.currentGame === player?.currentGame);
    if (player && bot) {
        player.ships = data.ships;
        player.matrix = shipsToMatrix(data.ships)

        bot.ships = botShipsPositions();
        bot.matrix = shipsToMatrix(bot.ships);
        const botResponse = startGame(player);
        return botResponse;
    }
}

export const botReceivesAttack = (data: string, ws: WebSocket) => {
    const player = mainDatabase.get(ws) as Player;
    const bot = botDatabase.find(b => b.currentGame === player?.currentGame) as Player;
    player.turn = false;
    const { x, y, gameId, indexPlayer } = JSON.parse(data);
    const attackResult = attackCheck({ x, y }, bot);
    if (attackResult) {
        return attackResponse({ x, y }, indexPlayer, attackResult, bot)
    }
}

export const botAttack = (ws: WebSocket) => {

    const player = mainDatabase.get(ws) as Player;
    const bot = botDatabase.find(b => b.currentGame === player?.currentGame) as Player;

    return botRandomAttack(player, bot);


}

export const botTurnResponse = (player: Player) => {
    player.turn = true;
    const data = JSON.stringify({
        currentPlayer: player.index
    })

    const response = JSON.stringify({
        type: "turn",
        data,
        id: 0,
    })
    return response;
}