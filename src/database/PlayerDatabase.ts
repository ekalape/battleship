import { Player } from '../utils/types';



class PlayerDatabase {
    private database: Player[]
    constructor() {
        this.database = []
    }
    get() { return this.database }
    set(playerName: string, index: number) {
        const player: Player = {
            name: playerName,
            index: index,
            insideRoom: false,
            room: null,
            currentGame: null
        }
        this.database.push(player)
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