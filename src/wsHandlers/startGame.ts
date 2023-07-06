import { IPlayer } from '../utils/types';

export const startGame = (player: IPlayer) => {
    console.log(`inside startGame ===> player found: ${player.index} with ships: ${player.ships.length}`)
    const gameData = JSON.stringify({
        ships: player.ships,
        currentPlayerIndex: player.index
    })
    console.log(`Gamedata from player ${player.index} inside startGameFN --> ${gameData}`)
    const response = JSON.stringify({
        type: "start_game",
        data: gameData,
        id: 0
    })

    return response;
}