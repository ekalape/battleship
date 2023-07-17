import botDatabase, { deleteBot } from '../database/botDatabase';
import mainDatabase from '../database/mainDatabase';
import Player from './Player';
import WebSocket from 'ws'
import { gameID } from './countID';

export const resetPlayers = (player: Player) => {
    player.ships = [];
    player.turn = false;
    player.matrix = [];
    player.currentGame = null;
    player.singleplay = false;
    player.room = null;
};

export const resetBotAndPlayer = (ws: WebSocket) => {
    const player = mainDatabase.get(ws);
    const bot = botDatabase.find(b => b.currentGame === player?.currentGame);
    if (player && bot) {
        bot.room = null;
        bot.currentGame = null;
        bot.ships = [];
        bot.matrix = [];
        deleteBot(bot.index);
        resetPlayers(player);
        const newGame = gameID()
        player.room = newGame;

    }
};
