
import database, { findWaiting } from '../database/database';
import { IMessage } from '../utils/types';

export const updateRoomStatus = () => {
    //([database.get(ws)?.room, database.get(ws)?.name, database.get(ws)?.index])

    const availableRooms = findWaiting().map(ws => ({ roomId: database.get(ws)?.room, roomUsers: [{ name: database.get(ws)?.name, index: database.get(ws)?.index }] }))

    const data = JSON.stringify(availableRooms)
    const response = JSON.stringify({
        type: "update_room",
        data,
        id: 0

    })
    return response
}


/* export const readinessCheck = (roomId: number) => {
    const room = roomDatabase.get().find(r => r.roomId === roomId);
    if (!room) throw new Error("No room found")
    if (room.roomUsers.length === 2) return true;
    else return false;
} */