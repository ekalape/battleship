
import mainDatabase, { findWaiting } from '../database/mainDatabase';
import { responseCreator } from '../utils/responseCreator';


export const updateRoomStatus = async () => {

    const availableRooms = (await findWaiting(false)).map(ws => ({ roomId: mainDatabase.get(ws)?.room, roomUsers: [{ name: mainDatabase.get(ws)?.name, index: mainDatabase.get(ws)?.index }] }))

    const data = JSON.stringify(availableRooms)
    return responseCreator("update_room", data)
}
