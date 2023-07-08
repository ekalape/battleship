import playerDatabase from '../database/PlayerDatabase';
import { attackHandler } from './attackHandler';

export const randomAttackHandler = (gameId: number, indexPlayer: number) => {

    const currentPlayers = playerDatabase.byGame(gameId);
    const opponent = currentPlayers?.find(pl => pl.index !== indexPlayer);
    let coords: { x: number, y: number };
    do {
        coords = createRandomCoords()
    } while (opponent?.matrix[coords.x][coords.y] === "x")

    const { response, hit } = attackHandler(coords, gameId, indexPlayer)

    return { response, hit }
};


const createRandomCoords = () => {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    return { x, y }
}