import { IShip } from './types';



export const shipsToMatrix = (ships: IShip[]): string[][] => {

    const matrix = Array(10).fill("0").map(() => { return Array(10).fill("0") });
    ships.forEach(s => {
        const { x, y } = s.position
        if (s.direction) {
            for (let i = y; i < y + s.length; i++) {
                matrix[x][i] === "1";
            }
        }
        else {
            for (let i = x; i < x + s.length; i++) {
                matrix[i][y] === "1";
            }
        }
    })
    return matrix;

};
