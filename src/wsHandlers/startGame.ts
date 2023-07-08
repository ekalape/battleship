import playerDatabase from '../database/PlayerDatabase';
import { IPlayer } from '../utils/types';

export const startGame = (player: IPlayer) => {

    const gameData = JSON.stringify({
        ships: player.ships,
        currentPlayerIndex: player.index
    })
    const response = JSON.stringify({
        type: "start_game",
        data: gameData,
        id: 0
    })

    return response;
}