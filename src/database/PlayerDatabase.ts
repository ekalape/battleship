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
        let playerIndex = this.database.findIndex(u => u.index === index)
        if (playerIndex < 0) throw Error("No user found");
        else {
            this.database.splice(playerIndex, 1);

        }
    }
    clear() {
        this.database = []
    }

}

const playerDatabase = new PlayerDatabase();

Object.freeze(playerDatabase);

export default playerDatabase;