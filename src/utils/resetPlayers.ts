import playerDatabase from '../database/PlayerDatabase';
import roomDatabase from '../database/RoomDatabase';
import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';
import { roomCount } from './countID';
import { IPlayer } from './types';

export const resetPlayers = (player: IPlayer) => {

    player.ships = [];
    player.turn = false;
    player.matrix = [];
    player.placedShips = false;
    player.currentGame = null;

    const roomId = roomCount();
    roomDatabase.createRoom(roomId);
    addPlayerToRoom(player.index, roomId)

};
