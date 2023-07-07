import playerDatabase from '../database/PlayerDatabase';

export const changeTurnHandler = (gameId: number) => {

    const players = playerDatabase.get().filter(pl => pl.currentGame === gameId);
    players.forEach(pl => pl.turn = !pl.turn);
    const currentTurnIndex = players.find(pl => pl.turn === true)?.index

    console.log(`currentTurnIndex ===> ${currentTurnIndex}`)
    const data = JSON.stringify({
        currentPlayer: currentTurnIndex
    })

    const response = JSON.stringify({
        type: "turn",
        data,
        id: 0,
    })
    return response;
}
