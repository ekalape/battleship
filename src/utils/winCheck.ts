
import Player from './Player';
import { responseCreator } from './responseCreator';

export const winCheck = (players: Player[]) => {
    if (players[0] && players[1]) {
        if (hasAliveShip(players[0].matrix)) {
            players[1].wins += 1;
            return players[1].index
        } else if (hasAliveShip(players[1].matrix)) {
            players[0].wins += 1;
            return players[0].index
        } else return null;
    }

};


const hasAliveShip = (matrix: string[][]) => {
    return !matrix.some(row => row.some(element => element === "1"));
}

export const winnerResponse = (winPlayer: number) => {
    const data = JSON.stringify({ winPlayer });
    return responseCreator("finish", data);
}