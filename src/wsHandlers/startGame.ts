import playerDatabase from '../database/PlayerDatabase'
import roomDatabase from '../database/RoomDatabase'
import { IPlayer } from '../utils/types'

export const startGame = (gameId: number, opponent: IPlayer) => {
    playerDatabase.getSinglePlayer(opponent.index).currentGame = gameId;
    const response = JSON.stringify({
        idGame: gameId,
        idPlayer: opponent.index
    })
    return response;
}