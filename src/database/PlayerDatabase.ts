import { IPlayer } from '../utils/types';
import WebSocket from 'ws';


class PlayerDatabase {
    private database: IPlayer[]
    constructor() {
        this.database = []
    }
    get() { return this.database }
    set(playerName: string, index: number, ws: WebSocket) {
        const player: IPlayer = {
            name: playerName,
            index: index,
            ws,
            room: null,
            currentGame: null,

        }
        this.database.push(player)
    }

    getSinglePlayer(index: number) {
        const player = this.database.find(p => p.index === index);
        if (!player) throw new Error("No user found")
        return player;
    }

    delete(index: number) {
        let player = this.database.find(u => u.index === index)
        if (!player) throw Error("No user found");
        else {
            this.database = this.database.filter(u => u.index !== index);
            return player
        }
    }
    getNextNumber() {
        return this.database.length + 1
    }

}

const playerDatabase = new PlayerDatabase();

Object.freeze(playerDatabase);

export default playerDatabase;