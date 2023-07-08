import playerDatabase from '../database/PlayerDatabase';

export const winCheck = (gameId: number) => {
    const players = playerDatabase.byGame(gameId);
    if (hasAliveShip(players[0].matrix)) {
        players[1].wins += 1;
        return players[1].index
    } else if (hasAliveShip(players[1].matrix)) {
        players[0].wins += 1;
        return players[0].index
    } else return null;
};


const hasAliveShip = (matrix: string[][]) => {
    return !matrix.some(row => row.some(element => element === "1"));
}

export const winnerResponse = (winPlayer: number) => {
    const data = JSON.stringify({ winPlayer });
    const response = JSON.stringify({
        type: "finish",
        data,
        id: 0,
    })
    return response;
}