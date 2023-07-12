
import Player from './Player';

export const winCheck = (players: Player[]) => {
    if (players[0] && players[1]) {
        if (hasAliveShip(players[0].matrix)) {
            players[1].wins += 1;
            console.log(`players[1] ${players[1].name} with index ${players[1].index} win added ${players[1].wins} `)
            return players[1].index
        } else if (hasAliveShip(players[1].matrix)) {
            players[0].wins += 1;
            console.log(`players[0] ${players[0].name} with index ${players[0].index} win added ${players[0].wins} `)
            return players[0].index
        } else return null;
    }

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