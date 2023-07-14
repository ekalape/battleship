
import Player from '../utils/Player';
import { responseCreator } from '../utils/responseCreator';
import { IShip, IShipPosition } from '../utils/types';

export const handleKilledShip = (coords: IShipPosition, index: number, opp: Player) => {

    const { x, y } = coords;
    let ship: IShip | undefined;
    for (let sh of opp.ships) {
        if ((sh.direction && (y >= sh.position.y && y < sh.position.y + sh.length && x === sh.position.x)) ||
            (sh.direction === false && (x >= sh.position.x && x < sh.position.x + sh.length && y === sh.position.y))
        ) { ship = sh }
    }
    if (ship) {
        const { x: shipX, y: shipY } = ship.position;
        const startX = shipX - 1
        const startY = shipY - 1
        const endX = ship.direction ? shipX + 1 : shipX + ship.length
        const endY = ship.direction ? shipY + ship.length : shipY + 1;

        const shipCoords = [];
        const aroundCoords = [];

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (x >= 0 && x < 10 && y >= 0 && y < 10) {
                    if (opp.matrix[x][y] === "x") {
                        shipCoords.push({ x, y })
                    } else aroundCoords.push({ x, y })
                }
            }
        }

        const responseArray = []

        for (let el of shipCoords) {
            const attackResponse = { position: { x: el.x, y: el.y }, currentPlayer: index, status: "killed" }
            const data = JSON.stringify(attackResponse)
            const response = responseCreator("attack", data)
            responseArray.push(response)
        }
        for (let el of aroundCoords) {
            const attackResponse = { position: { x: el.x, y: el.y }, currentPlayer: index, status: "miss" }
            const data = JSON.stringify(attackResponse)
            const response = responseCreator("attack", data)
            responseArray.push(response)
        }


        return responseArray;

    }

};
