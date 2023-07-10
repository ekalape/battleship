import playerDatabase from '../database/PlayerDatabase';

import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';
import Player from './Player';
import { roomCount } from './countID';
import { IPlayer } from './types';

export const resetPlayers = (player: Player) => {

    player.ships = [];
    player.turn = false;
    player.matrix = [];
    player.currentGame = null;
    player.room = null;

    /*  const roomId = roomCount();
     addPlayerToRoom(player, roomId) */
    console.log("player reseted >> ", JSON.stringify(player))

};
