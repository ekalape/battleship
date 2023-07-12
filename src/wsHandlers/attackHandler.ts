
import mainDatabase, { findByGame } from '../database/mainDatabase';
import { handleKilledShip } from './handleKilledShip';
import { AttackDataType, IShipPosition } from '../utils/types';
import Player from '../utils/Player';


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
        else if (opponent.matrix[x][y] === "x") {
            return;
        }
        else {
            result = updateMatrix(opponent.matrix, x, y);
            opponent.matrix[x][y] = "x";
        }

    } return result;
}

export const attackResponse = (aPos: IShipPosition, indexPlayer: number, status: "miss" | "killed" | "shot", opp: Player) => {

    const attackResponse: AttackDataType = { position: aPos, currentPlayer: indexPlayer, status }
    const data = JSON.stringify(attackResponse)
    const response = JSON.stringify({
        type: "attack",
        data,
        id: 0

    })
    let responseArray;
    if (status === "killed") {
        responseArray = handleKilledShip(aPos, indexPlayer, opp)
    }
    return { response, hit: status, responseArray };
}

function updateMatrix(matrix: string[][], x: number, y: number) {
    const ship: string[] = []

    const directions = [
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
        { dx: 0, dy: -1 }, // top
        { dx: 0, dy: 1 },  // bottom
    ];
    for (const direction of directions) {
        const newX = x + direction.dx;
        const newY = y + direction.dy;

        if (
            newX >= 0 &&
            newX < matrix.length &&
            newY >= 0 &&
            newY < matrix[newX].length
        ) {
            const neighbor = matrix[newX][newY];
            if (neighbor === "0") {
                continue;
            }
            if (neighbor === "x" || neighbor === "1") {
                ship.push(neighbor)
            }
        }
    }
    if (ship.every(s => s === "x")) return "killed";
    else return "shot"

}