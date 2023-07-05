import roomDatabase from '../database/RoomDatabase';
import { IPlayer } from '../utils/types';

export const addPlayerToRoom = (playerIndex: number, roomId: number) => {

    if (playerIndex === roomId) { throw new Error("You can not enter own room") }
    roomDatabase.addPlayer(playerIndex, roomId);


};
