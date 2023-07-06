import playerDatabase from '../database/PlayerDatabase';

export const changeTurnHandler = (gameId: number, turnNum: number) => {

    const players = playerDatabase.get().filter(pl => pl.currentGame === gameId);
    players.forEach(pl => pl.turn = false);
    players[turnNum].turn = true;


    const data = JSON.stringify({
        currentPlayer: players[turnNum].index
    })
    console.log(`turnIndex ---> ${turnNum}`)
    const response = JSON.stringify({
        type: "turn",
        data,
        id: 0,
    })
    return response;
}

export const turnCounter = () => {
    let turn = 0;
    return () => {
        const value = turn % 2;
        turn++;
        return value;
    }
}