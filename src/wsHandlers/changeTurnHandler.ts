import Player from '../utils/Player';
import { responseCreator } from '../utils/responseCreator';

export const changeTurnHandler = (players: Player[], change: boolean) => {

    if (change) {
        players.forEach(pl => { if (pl) pl.turn = !pl.turn });
    }
    let currentTurnIndex = players.find(pl => pl && pl.turn === true)?.index
    if (!currentTurnIndex) {
        const playerToStart = randomTurn(players[0], players[1]);
        if (playerToStart) {

            playerToStart.turn = true;
            currentTurnIndex = playerToStart.index;
        }
    }
    const data = JSON.stringify({
        currentPlayer: currentTurnIndex
    })

    return responseCreator("turn", data);

}

export const randomTurn = (player1: Player, player2: Player) => {
    const random = Math.floor(Math.random() * 2);
    return random === 0 ? player1 : player2;
}