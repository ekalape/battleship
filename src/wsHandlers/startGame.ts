
import Player from '../utils/Player';
import { responseCreator } from '../utils/responseCreator';


export const startGame = (player: Player) => {
    if (player) {

        const gameData = JSON.stringify({
            ships: player.ships,
            currentPlayerIndex: player.index
        })

        return responseCreator("start_game", gameData);
    }
}