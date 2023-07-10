import WebSocket, { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { AddShipsType, IMessage, RegResponseType, WebSocketClient, regRequestType } from '../utils/types';
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
import database, { findAvailable, findByGame, findByIndex, findByRoom, findWaiting } from '../database/database';
import { nameValidation } from '../utils/nameValidation';



const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws: WebSocket) {
    console.log(`New WebSocket is connected on port ${process.env.PORT || 3000}`)

    const response: IMessage = { type: null, data: "", id: 0 };
    let playerData: RegResponseType | null = null;


    ws.on('error', console.error);

    ws.on('close', () => {
        try {
            const player = database.get(ws);
            if (player?.currentGame) {
                const opponent = Array.from(database.entries()).find(([, value]) => value.currentGame === player.currentGame && value.index !== player.index);
                if (opponent) {
                    const winResponse = winnerResponse(opponent[1].index);
                    opponent[0].send(winResponse)
                    opponent[1].wins += 1;
                    player.room = null;
                    resetPlayers(opponent[1]);
                }
                wss.clients.forEach(pl => {
                    pl.send(updateWinners())
                    pl.send(updateRoomStatus())
                })
            }
            database.delete(ws)

        } catch (err) {
            if (err instanceof Error)
                console.log(err.message)
            else console.log("Unknown Error")
        }
        console.log('closing ws');
    });

    ws.on('message', function message(data) {

        try {
            const parsedData = JSON.parse(data.toString());
            console.log(`\ntype ---> ${parsedData.type}`)


            switch (parsedData.type) {
                case "reg":
                    {
                        const playerData: regRequestType = JSON.parse(parsedData.data);
                        const response = regHandler(playerData.name, playerData.password, ws)
                        console.log("response >> ", response)
                        console.log("findWaiting >> ", findWaiting(false).map(w => database.get(w)?.index))
                        console.log("findAvailable >> ", findAvailable().map(w => database.get(w)?.index));
                        ws.send(response)
                        wss.clients.forEach(pl => {
                            pl.send(updateRoomStatus());
                            pl.send(updateWinners())
                        })

                        break;
                    }

                case "create_room":
                    {
                        const roomId = roomCount()
                        const player = database.get(ws);
                        if (player) {
                            addPlayerToRoom(player, roomId)
                            wss.clients.forEach(pl => {
                                pl.send(updateRoomStatus())
                            })
                        }

                        break;
                    }

                case "add_user_to_room": {
                    const playerData: { indexRoom: number } = JSON.parse(parsedData.data);
                    const player = database.get(ws)
                    if (player) {
                        addPlayerToRoom(player, playerData.indexRoom);

                        const players = findByRoom(playerData.indexRoom);
                        if (players.length === 2) {
                            const gameId = gameID()

                            players[0].send(createGame(players[0], gameId))
                            players[1].send(createGame(players[1], gameId))
                        }
                        wss.clients.forEach(pl => {
                            pl.send(updateRoomStatus())
                        })
                    }
                    break;
                }

                case "add_ships": {
                    const startingData: AddShipsType = JSON.parse(parsedData.data)

                    const playersWs = findByGame(startingData.gameId);
                    const players = playersWs.map(w => database.get(w)) as Player[]

                    const actualPlayer = database.get(ws)
                    if (actualPlayer) {
                        actualPlayer.ships = startingData.ships;
                        actualPlayer.matrix = shipsToMatrix(startingData.ships)
                    }

                    if (players.every(pl => pl?.ships && pl?.ships.length > 0)) {
                        const startResponse0 = startGame(players[0] as Player);
                        const startResponse1 = startGame(players[1] as Player);
                        playersWs[0].send(startResponse0);
                        playersWs[1].send(startResponse1);
                    }

                    const turnResponse = changeTurnHandler(players, true)
                    console.log(turnResponse)
                    playersWs.forEach(w => w.send(turnResponse))
                    break;
                }

                case "attack": {
                    const { x, y, gameId, indexPlayer } = JSON.parse(parsedData.data);
                    const player = database.get(ws)
                    if (!player?.turn) {
                        break;
                    }

                    const playersWs = findByGame(gameId);
                    const players = playersWs.map(w => database.get(w)) as Player[]
                    let turnResponse: string;
                    if (playersWs) {
                        const attackResult = attackHandler({ x, y }, gameId, indexPlayer)
                        if (!attackResult) {
                            turnResponse = changeTurnHandler(players, false);
                            /*                             playersWs.forEach(pl => {                          
                                                            pl.send(turnResponse);
                                
                                                        }) */
                            ws.send(turnResponse)

                            break
                        };

                        const { response, hit } = attackResult;

                        if (hit) { turnResponse = changeTurnHandler(players, false) }
                        else {
                            turnResponse = changeTurnHandler(players, true)
                        }
                        playersWs.forEach(pl => {
                            pl.send(response);
                            pl.send(turnResponse);

                        })
                    }
                    const winner = winCheck(gameId)
                    if (winner) {
                        const winResponse = winnerResponse(winner)
                        playersWs.forEach(pl => {
                            pl.send(winResponse);
                        });
                        resetPlayers(player);
                        /*    if (player.room === null) {
                               const roomId = roomCount();
                               addPlayerToRoom(player, roomId)
                           } */

                        Array.from(database.keys()).forEach(pl => {
                            pl.send(updateWinners());
                            pl.send(updateRoomStatus())
                        })
                    }
                    break;
                }

                case "randomAttack": {
                    const { gameId, indexPlayer } = JSON.parse(parsedData.data)
                    const player = database.get(ws)
                    if (!player?.turn) {
                        break;
                    }
                    const playersWs = findByGame(gameId);
                    const players = playersWs.map(w => database.get(w)) as Player[]
                    const attackResult = randomAttackHandler(gameId, indexPlayer);
                    if (!attackResult) break;
                    const { response, hit } = attackResult;
                    let turnResponse: string;
                    if (hit) { turnResponse = changeTurnHandler(players, false) }
                    else {
                        turnResponse = changeTurnHandler(players, true)
                    }
                    playersWs.forEach(pl => {
                        pl.send(response);
                        pl.send(turnResponse);
                    })
                    const winner = winCheck(gameId)
                    if (winner) {
                        const winResponse = winnerResponse(winner)
                        playersWs.forEach(pl => {
                            pl.send(winResponse);
                        });
                        players.forEach(pl => {
                            resetPlayers(pl);
                        })

                        Array.from(database.keys()).forEach(pl => {
                            pl.send(updateWinners());
                            pl.send(updateRoomStatus())
                        })
                    }

                    break;
                }
                default: {
                    console.log("default case type", parsedData.type);
                    console.log("default case data", parsedData.data);

                }
            }


        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message)
                //  console.log(err.stack)
            }
            else console.log("Unknown Error")
        }
    });

});

export default wss;