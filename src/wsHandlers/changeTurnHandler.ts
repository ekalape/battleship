import playerDatabase from '../database/PlayerDatabase';
import database, { findByGame } from '../database/database';
import Player from '../utils/Player';
import { IPlayer } from '../utils/types';

export const changeTurnHandler = (players: Player[], change: boolean) => {
    console.log(`inside turnChanger players ---> ${JSON.stringify(players)}`)

    /* if (players[0] && players[1]) { */
    if (change) {
        players.forEach(pl => { if (pl) pl.turn = !pl.turn });
    }
    let currentTurnIndex = players.find(pl => pl && pl.turn === true)?.index
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
    /*   } else throw Error("No players found") */





    /*     const players = playerDatabase.byGame(gameId);
        console.log(`inside turn changer ==> ${JSON.stringify(players.map(pl => ({ pl: pl.index, turn: pl.turn })))}`)
        if (change) {
            players.forEach(pl => pl.turn = !pl.turn);
        }
        let currentTurnIndex = players.find(pl => pl.turn === true)?.index
        if (!currentTurnIndex) {
            const playerToStart = randomTurn(players[0], players[1]);
            playerToStart.turn = true;
            currentTurnIndex = playerToStart.index;
    
        } */


}

export const randomTurn = (player1: Player, player2: Player) => {
    const random = Math.floor(Math.random() * 2);
    return random === 0 ? player1 : player2;
}