import { IPlayer, WebSocketClient } from '../utils/types';
import WebSocket from 'ws';


class PlayerDatabase {
    private database: IPlayer[]
    constructor() {
        this.database = []
    }
    get() { return this.database }
    set(playerName: string, index: number, ws: WebSocketClient) {
        const player: IPlayer = {
            name: playerName,
            index: index,
            ws,
            room: null,
            currentGame: null,
            placedShips: false,
            ships: [],
            matrix: [],
            turn: false,
            wins: 0,

        }
        this.database.push(player)
    }

    getSinglePlayer(index: number) {
        const player = this.database.find(p => p.index === index);
        if (!player) throw new Error("No user found")
        return player;
    }
    byGame(gameId: number) {
        return this.database.filter(pl => pl.currentGame === gameId)
    }
    available() {
        return this.database.filter(pl => pl.currentGame === null)
    }

    delete(index: number) {
        let playerIndex = this.database.findIndex(u => u.index === index)
        if (playerIndex < 0) throw Error("No user found");
        else {
            this.database.splice(playerIndex, 1);

        }
    }
}

const playerDatabase = new PlayerDatabase();

Object.freeze(playerDatabase);

export default playerDatabase;