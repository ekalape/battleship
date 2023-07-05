import { IRoom } from '../utils/types';
import playerDatabase from './PlayerDatabase';



class RoomDatabase {
    private database: IRoom[]

    constructor() {
        this.database = []
    }
    get() { return this.database }
    createRoom(roomId: number) {

        this.database.push({ roomId, roomUsers: [] })
    }
    addPlayer(index: number, roomId: number) {
        const room = this.database.find(r => r.roomId === roomId);
        if (!room) throw new Error("Unexistent room");

        if (room.roomUsers.length === 2) throw new Error("The room is full");

        const player = playerDatabase.getSinglePlayer(index)
        if (player.room === roomId) { throw new Error("You can not enter own room") }
        const oldRoom = this.database.find(r => r.roomId === player.room)
        const playerPlace = oldRoom?.roomUsers.findIndex(u => u.index === player.index);
        if (playerPlace)
            oldRoom?.roomUsers.splice(playerPlace, 1)

        room.roomUsers.push({ name: player.name, index: player.index });
        player.room = roomId;

    }

    delete(roomId: number) {
        const room = this.database.find(r => r.roomId === roomId);
        if (!room) throw new Error("No room found")
        this.database = this.database.filter(u => u.roomId === roomId)
    }
    getNextNumber() {
        return this.database.length + 1
    }

}

const roomDatabase = new RoomDatabase();

Object.freeze(roomDatabase);

export default roomDatabase;