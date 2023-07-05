import roomDatabase from '../database/RoomDatabase'
import { IMessage } from '../utils/types';

export const updateRoomStatus = () => {
    const availableRooms = roomDatabase.get();
    const data = JSON.stringify(availableRooms)
    const response: IMessage = {
        type: "update_room",
        data,
        id: 0

    }
    return response
}