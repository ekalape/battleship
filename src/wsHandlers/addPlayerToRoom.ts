
import database, { findWaiting } from '../database/database';
import Player from '../utils/Player';

export const addPlayerToRoom = (player: Player, roomId: number) => {

    if (player.room === roomId) throw new Error("You can not enter own room");
    const fullRooms = findWaiting(true).map(w => database.get(w)?.room)
    if (fullRooms.includes(roomId)) throw new Error("The room is full");
    player.room = roomId;
    console.log("fullRooms", fullRooms)
    console.log("singleRooms", findWaiting(false).map(w => database.get(w)?.room))


};
