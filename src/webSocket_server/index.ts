import WebSocket, { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { IMessage, RegResponseType, WebSocketClient, regRequestType } from '../utils/types';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';
//import roomDatabase from '../database/RoomDatabase';
import playerDatabase from '../database/PlayerDatabase';
import { gameID, roomCount, playerCount } from '../utils/countID';
import { createGame } from '../wsHandlers/createGame';
import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';
import { startGame } from '../wsHandlers/startGame';
import { changeTurnHandler, randomTurn } from '../wsHandlers/changeTurnHandler';
import { shipsToMatrix } from '../utils/shipsToMatrix';
import { attackHandler } from '../wsHandlers/attackHandler'
import { randomAttackHandler } from '../wsHandlers/randomAttackHandler';
import { resetPlayers } from '../utils/resetPlayers';
import { updateWinners } from '../wsHandlers/updateWinners';
import { winCheck, winnerResponse } from '../utils/winCheck';
import { httpServer } from '../http_server';
import Player from '../utils/Player';
import database, { findAvailable, findWaiting } from '../database/database';
import { nameValidation } from '../utils/nameValidation';



const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws: WebSocket) {
    console.log(`New WebSocket is connected on port ${process.env.PORT || 3000}`)

    const response: IMessage = { type: null, data: "", id: 0 };
    let playerData: RegResponseType | null = null;


    ws.on('error', console.error);

    ws.on('close', () => {
        /*     try {
    
                playerDatabase.delete(ws.id);
                roomDatabase.removePlayer(ws.id)
                wss.clients.forEach(client => client.send(JSON.stringify(updateRoomStatus())))
    
            } catch (err) {
                if (err instanceof Error)
                    console.log(err.message)
                else console.log("Unknown Error")
            } */
        console.log('closing ws');
    });

    ws.on('message', function message(data) {

        try {
            const parsedData = JSON.parse(data.toString());
            console.log(`\ntype ---> ${parsedData.type}`)
            const playerData: regRequestType = JSON.parse(parsedData.data);

            switch (parsedData.type) {
                case "reg":
                    {
                        const response = regHandler(playerData.name, playerData.password, ws)
                        console.log("response >> ", response)
                        console.log("findWaiting >> ", findWaiting().map(w => database.get(w)?.index))
                        console.log("findAvailable >> ", findAvailable().map(w => database.get(w)?.index));
                        ws.send(response)
                        findAvailable().forEach(pl => {
                            pl.send(updateRoomStatus())
                        })

                        /*    response.type = "reg";
                           const socketIndex = playerCount()
                           ws.id = socketIndex
                           playerData = regHandler(socketIndex, parsedData.data, ws);
                           response.data = JSON.stringify(playerData);
                           ws.send(JSON.stringify(response));
   
                           const roomId = roomCount()
                           roomDatabase.createRoom(roomId);
                           roomDatabase.addPlayer(ws.id, roomId)
                           const freePlayers = playerDatabase.available()
                           freePlayers.forEach(pl => {
                               pl.ws.send(updateWinners());
                               pl.ws.send(JSON.stringify(updateRoomStatus()))
                           }) */
                        break;
                    }

                case "create_room":
                    {
                        /* 
                                                const roomId = roomCount()
                                                roomDatabase.createRoom(roomId);
                        
                                                addPlayerToRoom(ws.id, roomId)
                                                const freePlayers = playerDatabase.available()
                                                freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
                         */
                        break;
                    }

                case "add_user_to_room":

                    /*    const parsedRoomInfo = JSON.parse(parsedData.data);
                       const roomId = parsedRoomInfo?.indexRoom;
                       addPlayerToRoom(ws.id, roomId)
                       const freePlayers = playerDatabase.available()
                       freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
                       const ready = readinessCheck(roomId)
                       if (ready) {
                           const readyPlayers = playerDatabase.get().filter(pl => pl.room === roomId)
                           const gameid = gameID()
                           console.log("gameid started", gameid)
                           console.log(`players:  ${readyPlayers[0].name} and ${readyPlayers[1].name} from room ${roomId}`)
   
                           readyPlayers[0].ws.send(createGame(gameid, readyPlayers[0]));
                           readyPlayers[1].ws.send(createGame(gameid, readyPlayers[1]));
                       }
   
    */
                    break;

                case "add_ships": {
                    const gamedata = JSON.parse(parsedData.data)
                    /*    const player = playerDatabase.getSinglePlayer(gamedata.indexPlayer);
   
                       player.ships = gamedata.ships;
                       player.matrix = shipsToMatrix(player.ships);
                       player.placedShips = true;
                       const gameId: number = gamedata.gameId;
                       const players = playerDatabase.byGame(gameId)
                       console.log("players >>> ", players[0].index, players[1].index)
                       if (players.length !== 2) throw new Error("Game error")
                       //  randomTurn(players[0], players[1]).turn = true;
                       //const playerToStart = randomTurn(players[0], players[1])
                       // console.log(`playerToStart = ${playerToStart.index}`)
                       if (players.every(pl => pl.placedShips)) {
                           const pl0response = startGame(players[0]);
                           const pl1response = startGame(players[1]);
                           players[0].ws.send(pl1response);
                           players[1].ws.send(pl0response);
                           const turnResponse = changeTurnHandler(gameId, false)
                           players.forEach(pl => {
                               pl.ws.send(turnResponse)
                           })
                       } */
                    break;
                }

                case "attack": {
                    /*      const attackData = JSON.parse(parsedData.data);
                         const { x, y, gameId, indexPlayer } = attackData;
                         const players = playerDatabase.byGame(gameId);
                         if (players.find(pl => pl.turn === true)?.index !== indexPlayer) {
                             break
                         };
     
                         const { response, hit } = attackHandler({ x, y }, gameId, indexPlayer)
                         let turnResponse: string;
                         if (hit) { turnResponse = changeTurnHandler(gameId, false) }
                         else {
                             turnResponse = changeTurnHandler(gameId, true)
                         }
                         players.forEach(pl => {
                             pl.ws.send(response);
                             pl.ws.send(turnResponse);
     
                         })
                         const winner = winCheck(gameId)
     
                         if (winner) {
                             const winResponse = winnerResponse(winner)
                             players.forEach(pl => {
                                 pl.ws.send(winResponse);
                                 resetPlayers(pl);
                             });
     
                             playerDatabase.get().forEach(pl => {
                                 pl.ws.send(updateWinners());
                                 pl.ws.send(JSON.stringify(updateRoomStatus()))
                             })
     
                             const roomId = roomCount();
                             roomDatabase.createRoom(roomId);
                             addPlayerToRoom(ws.id, roomId)
     
                         } */
                    break;
                }

                case "randomAttack": {
                    /*      const { gameId, indexPlayer } = JSON.parse(parsedData.data);
                         const players = playerDatabase.byGame(gameId);
                         const { response, hit } = randomAttackHandler(gameId, indexPlayer);
                         let turnResponse: string;
                         if (hit) { turnResponse = changeTurnHandler(gameId, false) }
                         else {
                             turnResponse = changeTurnHandler(gameId, true)
                         }
                         players.forEach(pl => {
                             pl.ws.send(response);
                             pl.ws.send(turnResponse);
                         })
                         const winner = winCheck(gameId)
                         if (winner) {
                             const winResponse = winnerResponse(winner)
                             players.forEach(pl => {
                                 pl.ws.send(winResponse);
                                 resetPlayers(pl);
                             });
     
                             playerDatabase.get().forEach(pl => {
                                 pl.ws.send(updateWinners());
                                 pl.ws.send(JSON.stringify(updateRoomStatus()))
                             })
     
                             const roomId = roomCount();
                             roomDatabase.createRoom(roomId);
                             addPlayerToRoom(ws.id, roomId)
                         } */
                    break;
                }
                default: {
                    console.log("default case type", parsedData.type);
                    console.log("default case data", parsedData.data);

                }
            }


        } catch (err) {
            if (err instanceof Error)
                console.log(err.message)
            else console.log("Unknown Error")
        }
    });

});

export default wss;