
import mainDatabase from '../database/mainDatabase'

export const updateWinners = () => {
    const winners = Array.from(mainDatabase.entries()).map(([, value]) => ({ name: value.name, wins: value.wins }))
    const gameData = JSON.stringify(winners)
    const response = JSON.stringify({
        type: "update_winners",
        data: gameData,
        id: 0
    })

    return response;
}