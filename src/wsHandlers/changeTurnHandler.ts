import playerDatabase from '../database/PlayerDatabase';
import { IPlayer } from '../utils/types';

export const changeTurnHandler = (gameId: number, change: boolean) => {

    const players = playerDatabase.byGame(gameId);
    console.log(`inside turn changer ==> ${JSON.stringify(players.map(pl => ({ pl: pl.index, turn: pl.turn })))}`)
    if (change) {
        players.forEach(pl => pl.turn = !pl.turn);
    }
    let currentTurnIndex = players.find(pl => pl.turn === true)?.index
    if (!currentTurnIndex) {
        const playerToStart = randomTurn(players[0], players[1]);
        playerToStart.turn = true;
        currentTurnIndex = playerToStart.index;

    }

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

export const randomTurn = (player1: IPlayer, player2: IPlayer) => {
    const random = Math.floor(Math.random() * 2);
    return random === 0 ? player1 : player2;
}