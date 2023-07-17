
import mainDatabase from '../database/mainDatabase'
import { responseCreator } from '../utils/responseCreator'

export const updateWinners = () => {
    const winners = Array.from(mainDatabase.entries()).map(([, value]) => ({ name: value.name, wins: value.wins }))
    const gameData = JSON.stringify(winners)
    return responseCreator("update_winners", gameData);
}