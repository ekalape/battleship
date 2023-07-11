import Player from '../utils/Player';

export const changeTurnHandler = (players: Player[], change: boolean) => {

    if (change) {
        players.forEach(pl => { if (pl) pl.turn = !pl.turn });
    }
    let currentTurnIndex = players.find(pl => pl && pl.turn === true)?.index
    if (!currentTurnIndex) {
        const playerToStart = randomTurn(players[0], players[1]);
        playerToStart.turn = true;
        currentTurnIndex = playerToStart.index;
    }
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

export const randomTurn = (player1: Player, player2: Player) => {
    const random = Math.floor(Math.random() * 2);
    return random === 0 ? player1 : player2;
}