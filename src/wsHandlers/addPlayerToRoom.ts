import playerDatabase from '../database/PlayerDatabase';
import roomDatabase from '../database/RoomDatabase';


export const addPlayerToRoom = (playerIndex: number, roomId: number) => {
    let ready = false
    const room = roomDatabase.get().find(r => r.roomId === roomId);
    if (!room) throw new Error("Unexistent room");
    const player = playerDatabase.getSinglePlayer(playerIndex)
    if (player.room === roomId) { throw new Error("You can not enter own room") }
    if (room?.roomUsers.length === 2) throw new Error("The room is full");

    const oldRoom = roomDatabase.get().find(r => r.roomId === player.room);
    if (typeof oldRoom !== 'undefined' && oldRoom.roomUsers.length < 2) {
        roomDatabase.delete(oldRoom.roomId);
        roomDatabase.addPlayer(playerIndex, roomId)
    }

    if (room.roomUsers.length === 2) {
        ready = true
    }
    return ready
};
