import { IShip } from './types';



export const shipsToMatrix = (ships: IShip[]): string[][] => {

    const matrix = Array(10).fill("0").map(() => { return Array(10).fill("0") });
    ships.forEach(s => {
        const { x, y } = s.position
        /*         console.log(`s.position ==> ${x} and ${y}`)
                console.log(`s.direction ==> ${s.direction}`)
                console.log(`s.length ==> ${s.length}`) */
        if (s.direction) {
            for (let i = y; i < y + s.length; i++) {
                matrix[x][i] = "1";
                //  console.log(`------- matrix[x][i] --> ${matrix[x][i]} => x=${x}, y=${i}`)
            }
        }
        else {
            for (let i = x; i < x + s.length; i++) {
                matrix[i][y] = "1";
            }
        }
    })
    console.log(matrix.toString())
    return matrix;
};
