import playerDatabase from '../database/PlayerDatabase'
import database from '../database/database'

export const updateWinners = () => {
    // const winners = playerDatabase.get().map(pl => ({ name: pl.name, wins: pl.wins }))
    const winners = Array.from(database.entries()).map(([, value]) => ({ name: value.name, wins: value.wins }))
    const gameData = JSON.stringify(winners)
    const response = JSON.stringify({
        type: "update_winners",
        data: gameData,
        id: 0
    })

    return response;
}