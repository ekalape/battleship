import Player from './Player';
export const resetPlayers = (player: Player) => {

    player.ships = [];
    player.turn = false;
    player.matrix = [];
    player.currentGame = null;
    player.room = null;
    console.log("player reseted >> ", JSON.stringify(player))

};
