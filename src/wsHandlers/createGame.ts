import playerDatabase from '../database/PlayerDatabase'
import { IPlayer } from '../utils/types'

export const createGame = (gameId: number, opponent: IPlayer) => {
    playerDatabase.getSinglePlayer(opponent.index).currentGame = gameId;
    const gameData = JSON.stringify({
        idGame: gameId,
        idPlayer: opponent.index
    })
    const response = JSON.stringify({
        type: "create_game",
        data: gameData,
        id: 0
    })

    return response;
}