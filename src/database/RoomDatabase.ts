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

        const player = playerDatabase.getSinglePlayer(index)
        room?.roomUsers.push({ name: player.name, index: player.index });
        player.room = roomId;
    }
    removePlayer(index: number) {
        const room = this.database.find(r => r.roomUsers.some(u => u.index === index));
        console.log("del room >>", room)
        const roomUsers = room?.roomUsers;
        console.log("del roomUsers >>", roomUsers)
        const playerToDelete = roomUsers?.findIndex(u => u.index === index);
        console.log("del playerToDelete >>", playerToDelete)
        if (typeof playerToDelete === 'undefined' || playerToDelete < 0) throw new Error("Deleting error")
        room?.roomUsers.splice(playerToDelete, 1)
    }

    delete(roomId: number) {
        const roomIndex = this.database.findIndex(r => r.roomId === roomId);
        if (roomIndex < 0) throw new Error("No room found")
        this.database.splice(roomIndex, 1);
        console.log(JSON.stringify(this.get()))
    }
    clear() {
        this.database = []
    }

}

const roomDatabase = new RoomDatabase();

Object.freeze(roomDatabase);

export default roomDatabase;