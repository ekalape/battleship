import playerDatabase from '../database/PlayerDatabase';

export const winCheck = (gameId: number) => {
    const players = playerDatabase.byGame(gameId);
    if (hasAliveShip(players[0].matrix)) {
        return players[1].index
    } else if (hasAliveShip(players[1].matrix)) {
        return players[2].index
    } else return null;
};


const hasAliveShip = (matrix: string[][]) => {
    return !matrix.some(row => row.some(element => element === "1"));
}