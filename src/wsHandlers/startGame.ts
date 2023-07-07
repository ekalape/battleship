import playerDatabase from '../database/PlayerDatabase';
import { IPlayer } from '../utils/types';

export const startGame = (player: IPlayer) => {
    const opponent = playerDatabase.get().filter(pl => pl.currentGame === player.currentGame && pl.index !== player.index)[0]

    const gameData = JSON.stringify({
        ships: opponent.ships,
        currentPlayerIndex: player.index
    })
    const response = JSON.stringify({
        type: "start_game",
        data: gameData,
        id: 0
    })

    return response;
}