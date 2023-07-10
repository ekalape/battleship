import playerDatabase from '../database/PlayerDatabase';
import Player from '../utils/Player';
import { shipsToMatrix } from '../utils/shipsToMatrix';
import { AddShipsType, IPlayer } from '../utils/types';

export const startGame = (player: Player) => {
    // if (player.currentGame !== data.gameId || player.index !== data.indexPlayer) throw new Error("Add ships from unknown player")



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