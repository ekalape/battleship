
import mainDatabase, { findByGame } from '../database/mainDatabase';
import { handleKilledShip } from './handleKilledShip';
import { AttackDataType, IShipPosition } from '../utils/types';
import Player from '../utils/Player';
import { responseCreator } from '../utils/responseCreator';


export const attackHandler = (aPos: IShipPosition, gameId: number, indexPlayer: number) => {
    const opponent = findByGame(gameId).map(w => mainDatabase.get(w)).find(pl => pl?.index !== indexPlayer);
    if (!opponent) throw new Error("No opponent found for this player")
    const result = attackCheck(aPos, opponent);
    if (result) return attackResponse(aPos, indexPlayer, result, opponent)
}


export const attackCheck = (aPos: IShipPosition, opponent: Player) => {

    let result: "miss" | "killed" | "shot" | undefined;

    if (opponent) {
        const { x, y } = aPos;

        if (opponent.matrix[x][y] === "0") {
            result = "miss"
        }
        if (opponent.matrix[x][y] === "1") {
            opponent.matrix[x][y] = "x";
            result = updateMatrix(opponent, x, y);
        }

    } return result;
}

export const attackResponse = (aPos: IShipPosition, indexPlayer: number, status: "miss" | "killed" | "shot", opp: Player) => {

    const attackResponse: AttackDataType = { position: aPos, currentPlayer: indexPlayer, status }
    const data = JSON.stringify(attackResponse)
    const response = responseCreator("attack", data)
    let responseArray;
    if (status === "killed") {
        responseArray = handleKilledShip(aPos, indexPlayer, opp)
    }
    return { response, hit: status, responseArray };
}

function updateMatrix(opp: Player, x: number, y: number) {
    const ship: string[] = []
    const matrix = opp.matrix;
    const sh = opp.ships.find(s =>
        (s.direction && s.position.x === x && y >= s.position.y && y < (s.position.y + s.length)) ||
        (!s.direction && s.position.y === y && x >= s.position.x && x < (s.position.x + s.length))
    )

    if (sh) {
        if (sh.direction) {
            for (let i = sh.position.y; i < sh.position.y + sh.length; i++) {
                ship.push(matrix[x][i])
            }
        }
        else {
            for (let i = sh.position.x; i < sh.position.x + sh.length; i++) {
                ship.push(matrix[i][y])
            }
        }
    }

    if (ship.every(s => s === "x")) return "killed";
    else return "shot"

}