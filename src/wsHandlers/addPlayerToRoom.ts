
import mainDatabase, { findWaiting } from '../database/mainDatabase';
import Player from '../utils/Player';

export const addPlayerToRoom = (player: Player, roomId: number) => {

    if (player.room === roomId) throw new Error("You can not enter own room");
    const fullRooms = findWaiting(true).map(w => mainDatabase.get(w)?.room)
    if (fullRooms.includes(roomId)) throw new Error("The room is full");
    player.room = roomId;
};
