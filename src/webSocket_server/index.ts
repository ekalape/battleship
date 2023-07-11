import WebSocket, { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { AddShipsType, IMessage, RegResponseType, regRequestType } from '../utils/types';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';
import { gameID, roomCount } from '../utils/countID';
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
import mainDatabase, { findByGame, findByRoom } from '../database/mainDatabase';
import { botHandler } from '../wsHandlers/botHandler';


const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws: WebSocket) {
    console.log(`New WebSocket is connected on port ${process.env.PORT || 3000}`)

    const response: IMessage = { type: null, data: "", id: 0 };
    let playerData: RegResponseType | null = null;


    ws.on('error', console.error);

    ws.on('close', () => {
        try {
            const player = mainDatabase.get(ws);
            if (player?.currentGame) {
                const opponent = Array.from(mainDatabase.entries()).find(([, value]) => value.currentGame === player.currentGame && value.index !== player.index);
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
            console.log(`Player ${player?.name} is leaving game`);
            mainDatabase.delete(ws)

        } catch (err) {
            if (err instanceof Error)
                console.log(err.message)
            else console.log("Unknown Error")
        }

    });

    ws.on('message', function message(data) {

        try {
            const parsedData = JSON.parse(data.toString());
            console.log(`\ntype ---> ${parsedData.type}`)

            switch (parsedData.type) {
                case "reg":
                    const playerData: regRequestType = JSON.parse(parsedData.data);
                    const response = regHandler(playerData.name, playerData.password, ws)
                    ws.send(response)
                    wss.clients.forEach(pl => {
                        pl.send(updateRoomStatus());
                        pl.send(updateWinners())
                    })

                    break;

                case "create_room":
                    const roomId = roomCount()
                    const player = mainDatabase.get(ws);
                    if (player) {
                        addPlayerToRoom(player, roomId)
                        wss.clients.forEach(pl => {
                            pl.send(updateRoomStatus())
                        })
                    }
                    break;

                case "add_user_to_room": {
                    const playerData: { indexRoom: number } = JSON.parse(parsedData.data);
                    const player = mainDatabase.get(ws)
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
                    const actualPlayer = mainDatabase.get(ws)


                    const playersWs = findByGame(startingData.gameId);
                    const players = playersWs.map(w => mainDatabase.get(w)) as Player[]
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
                    const player = mainDatabase.get(ws)
                    if (!player?.turn) {
                        break;
                    }

                    const playersWs = findByGame(gameId);
                    const players = playersWs.map(w => mainDatabase.get(w)) as Player[]
                    let turnResponse: string;
                    if (playersWs) {
                        const attackResult = attackHandler({ x, y }, gameId, indexPlayer)
                        if (!attackResult) {
                            turnResponse = changeTurnHandler(players, false);
                            ws.send(turnResponse)

                            break
                        };
                        const { response, hit, responseArray } = attackResult;
                        if (["killed", "shot"].includes(hit)) { turnResponse = changeTurnHandler(players, false) }
                        else {
                            turnResponse = changeTurnHandler(players, true)
                        }
                        playersWs.forEach(pl => {
                            pl.send(response);
                        })
                        if (responseArray) {
                            if (responseArray) {
                                responseArray.forEach(res => {
                                    playersWs.forEach(pl => {
                                        pl.send(res);
                                    })
                                })
                            }
                        }
                        playersWs.forEach(pl => {
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

                        Array.from(mainDatabase.keys()).forEach(pl => {
                            pl.send(updateWinners());
                            pl.send(updateRoomStatus())
                        })
                    }
                    break;
                }

                case "randomAttack": {
                    const { gameId, indexPlayer } = JSON.parse(parsedData.data)
                    const player = mainDatabase.get(ws)
                    if (!player?.turn) {
                        break;
                    }
                    const playersWs = findByGame(gameId);
                    const players = playersWs.map(w => mainDatabase.get(w)) as Player[]
                    const attackResult = randomAttackHandler(gameId, indexPlayer);
                    if (!attackResult) break;
                    const { response, hit, responseArray } = attackResult;
                    let turnResponse: string;
                    if (["killed", "shot"].includes(hit)) { turnResponse = changeTurnHandler(players, false) }
                    else {
                        turnResponse = changeTurnHandler(players, true)
                    }
                    playersWs.forEach(pl => {
                        pl.send(response);
                    })
                    if (responseArray) {
                        if (responseArray) {
                            responseArray.forEach(res => {
                                playersWs.forEach(pl => {
                                    pl.send(res);
                                })
                            })
                        }
                    }
                    playersWs.forEach(pl => {
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

                        Array.from(mainDatabase.keys()).forEach(pl => {
                            pl.send(updateWinners());
                            pl.send(updateRoomStatus())
                        })
                    }

                    break;
                }

                case "single_play": {
                    const singleplayResponse = botHandler(ws);
                    ws.send(singleplayResponse);
                    wss.clients.forEach(cl => cl.send(updateRoomStatus()))

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