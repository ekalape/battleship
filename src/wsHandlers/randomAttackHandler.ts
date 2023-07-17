
import Player from '../utils/Player';
import { attackCheck, attackResponse } from './attackHandler';

export const randomAttackHandler = (indexPlayer: number, opponent: Player) => {

    let coords: { x: number, y: number };
    do {
        coords = createRandomCoords()
    } while (opponent?.matrix[coords.x][coords.y] === "x")

    const attackResult = attackCheck(coords, opponent)
    if (attackResult) {
        return attackResponse(coords, indexPlayer, attackResult, opponent)
    }
    else return;

};

export const botRandomAttack = (player: Player, bot: Player) => {
    let coords: { x: number, y: number };
    const gameId = player.currentGame
    do {
        coords = createRandomCoords()
    } while (player?.matrix[coords.x][coords.y] === "x")

    const attackResult = attackCheck(coords, player);
    if (attackResult && gameId) {
        return attackResponse(coords, bot.index, attackResult, player)
    }
    else return;
}


const createRandomCoords = () => {
    const x = Math.floor(Math.random() * 10)
    const y = Math.floor(Math.random() * 10)
    return { x, y }
}