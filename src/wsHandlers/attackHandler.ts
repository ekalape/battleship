import playerDatabase from '../database/PlayerDatabase';
import database, { findByGame } from '../database/database';
import { IShipPosition } from '../utils/types';


export const attackHandler = (aPos: IShipPosition, gameId: number, indexPlayer: number) => {
    const opponent = findByGame(gameId).map(w => database.get(w)).find(pl => pl?.index !== indexPlayer);
    let result = "";
    if (opponent) {
        const { x, y } = aPos;

        if (opponent.matrix[x][y] === "0") {
            result = "miss"
        }
        else {
            result = updateMatrix(opponent.matrix, x, y);
            opponent.matrix[x][y] = "x";
        }

    }
    const attackResponse = { position: aPos, currentPlayer: indexPlayer, status: result }
    const data = JSON.stringify(attackResponse)
    const response = JSON.stringify({
        type: "attack",
        data,
        id: 0

    })
    return { response, hit: result === "miss" ? false : true };
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