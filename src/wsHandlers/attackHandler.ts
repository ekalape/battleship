import playerDatabase from '../database/PlayerDatabase';
import { IMessage, IShipPosition } from '../utils/types';
import { winCheck } from '../utils/winCheck';

export const attackHandler = (aPos: IShipPosition, gameId: number, indexPlayer: number) => {
    const opponent = playerDatabase.byGame(gameId).find(pl => pl.index !== indexPlayer);
    let result = "";
    if (opponent) {
        console.log(`\nopponent --->${opponent?.index}`)
        console.log(`player --->${indexPlayer}\n`)
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
    const winner = winCheck(gameId)

    const data = winner ? JSON.stringify({ winPlayer: winner }) : JSON.stringify(attackResponse)
    const response = JSON.stringify({
        type: winner ? "finish" : "attack",
        data,
        id: 0

    })
    return { response, hit: result === "miss" ? false : true, winner };
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