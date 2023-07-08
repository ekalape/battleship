import roomDatabase from '../database/RoomDatabase'
import { IMessage } from '../utils/types';

export const updateRoomStatus = () => {
    const emptyRooms = roomDatabase.get().filter(r => r.roomUsers.length === 0);
    if (emptyRooms.length > 0)
        emptyRooms.forEach(room => roomDatabase.delete(room.roomId))
    const availableRooms = roomDatabase.get()
    const data = JSON.stringify(availableRooms)
    const response: IMessage = {
        type: "update_room",
        data,
        id: 0

    }
    return response
}


export const readinessCheck = (roomId: number) => {
    const room = roomDatabase.get().find(r => r.roomId === roomId);
    if (!room) throw new Error("No room found")
    if (room.roomUsers.length === 2) return true;
    else return false;
}