import { playerCount, roomCount } from './countID'
import { IShip } from './types'


export default class Player {
    name: string
    index: number
    room: number | null
    currentGame: number | null
    ships: IShip[]
    matrix: string[][]
    turn: boolean
    wins: number
    password: string
    singleplay: boolean
    constructor(name: string, password: string) {
        this.name = name;
        this.password = password;
        this.index = playerCount()
        this.room = roomCount();
        this.currentGame = null;
        this.ships = [];
        this.matrix = [];
        this.turn = false;
        this.wins = 0;
        this.singleplay = false;
    }

}