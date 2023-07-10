import playerDatabase from '../database/PlayerDatabase';
import database, { findByGame } from '../database/database';
import { attackHandler } from './attackHandler';

export const randomAttackHandler = (gameId: number, indexPlayer: number) => {

    const opponent = findByGame(gameId).map(w => database.get(w)).find(pl => pl?.index !== indexPlayer);
    let coords: { x: number, y: number };
    do {
        coords = createRandomCoords()
    } while (opponent?.matrix[coords.x][coords.y] === "x")

    const attackResult = attackHandler(coords, gameId, indexPlayer)
    if (attackResult) {

        return { response: attackResult.response, hit: attackResult.hit }
    }
    else return;

};


const createRandomCoords = () => {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    return { x, y }
}