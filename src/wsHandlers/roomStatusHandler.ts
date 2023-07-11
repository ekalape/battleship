
import mainDatabase, { findWaiting } from '../database/mainDatabase';


export const updateRoomStatus = () => {

    const availableRooms = findWaiting(false).map(ws => ({ roomId: mainDatabase.get(ws)?.room, roomUsers: [{ name: mainDatabase.get(ws)?.name, index: mainDatabase.get(ws)?.index }] }))

    const data = JSON.stringify(availableRooms)
    const response = JSON.stringify({
        type: "update_room",
        data,
        id: 0

    })
    return response
}
