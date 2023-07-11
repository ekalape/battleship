import playerDatabase from '../database/PlayerDatabase';
import Player from '../utils/Player';


export const startGame = (player: Player) => {

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