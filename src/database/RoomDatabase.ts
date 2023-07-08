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
        const roomUsers = room?.roomUsers;
        const playerToDelete = roomUsers?.findIndex(u => u.index === index);
        console.log("Player is leaving >>", playerToDelete)
        if (typeof playerToDelete === 'undefined' || playerToDelete < 0) throw new Error("Deleting error")
        room?.roomUsers.splice(playerToDelete, 1)
    }

    delete(roomId: number) {
        const roomIndex = this.database.findIndex(r => r.roomId === roomId);
        console.log(`Deleting room ---> ${roomIndex}`)
        if (roomIndex < 0) throw new Error("No room found")
        this.database.splice(roomIndex, 1);
    }
    clearRoom(roomId: number) {
        const room = this.database.find(r => r.roomId);
        if (room) {
            room.roomUsers = [];
            playerDatabase.get().filter(pl => pl.room === room.roomId).forEach(pl => pl.room = null);
        };
        console.log(`Room ${roomId} is cleared: ${JSON.stringify(room?.roomUsers)}`)
    }

}

const roomDatabase = new RoomDatabase();

Object.freeze(roomDatabase);

export default roomDatabase;