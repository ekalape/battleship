import playerDatabase from '../database/PlayerDatabase'

export const updateWinners = () => {
    const winners = playerDatabase.get().map(pl => ({ name: pl.name, wins: pl.wins }))
    const gameData = JSON.stringify(winners)
    const response = JSON.stringify({
        type: "update_winners",
        data: gameData,
        id: 0
    })

    return response;
}