import WebSocket, { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { regRequestType } from '../utils/types';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';
import { roomCount } from '../utils/countID';
import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';
import { resetPlayers } from '../utils/resetPlayers';
import { updateWinners } from '../wsHandlers/updateWinners';
import { winnerResponse } from '../utils/winCheck';
import { httpServer } from '../http_server';
import Player from '../utils/Player';
import mainDatabase from '../database/mainDatabase';
import { botHandler } from '../wsHandlers/botHandler';
import botDatabase, { deleteBot } from '../database/botDatabase';
import oldFellasDB from '../database/oldFellasDB';
import { addToRoom_listener } from '../wsListeners/addToRoom_listener';
import { addShips_listener } from '../wsListeners/addShips_listener';
import { randomAttack_listener } from '../wsListeners/randomAttack_listener';
import { attack_listener } from '../wsListeners/attack_listener';



const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', function connection(ws: WebSocket) {
    console.log(`New websocket is connected using port ${process.env.PORT || 3000}`)

    ws.on('error', console.error);

    ws.on('close', () => {
        try {
            const player = mainDatabase.get(ws) as Player;
            if (player?.currentGame) {
                if (player.singleplay) {
                    const bot = botDatabase.find(b => b.currentGame === player.currentGame);
                    if (bot) deleteBot(bot?.index)
                } else {
                    const opponent = Array.from(mainDatabase.entries()).find(([, value]) => value.currentGame === player.currentGame && value.index !== player.index);
                    if (opponent) {
                        const winResponse = winnerResponse(opponent[1].index);
                        opponent[0].send(winResponse)
                        opponent[1].wins += 1;
                        player.room = null;
                        resetPlayers(opponent[1]);
                    }
                }

            }
            console.log(`Player ${player.name} is leaving game`);
            oldFellasDB.push({ name: player.name, password: player.password, wins: player.wins })
            mainDatabase.delete(ws)
            wss.clients.forEach(pl => {
                pl.send(updateWinners())
                pl.send(updateRoomStatus())
            })

        } catch (err) {
            if (err instanceof Error)
                console.log(err.message)
            else console.log("Unknown Error")
        }

    });

    ws.on('message', function message(data) {

        try {
            const parsedData = JSON.parse(data.toString());
            console.log(`Player's command: ${parsedData.type}`)
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
                    addToRoom_listener(parsedData.data, ws)
                    break;
                }

                case "add_ships": {
                    addShips_listener(parsedData.data, ws);
                    break;
                }

                case "attack": {
                    attack_listener(parsedData.data, ws)
                    Array.from(mainDatabase.keys()).forEach(pl => {
                        pl.send(updateWinners());
                        pl.send(updateRoomStatus())
                    })
                    break;
                }

                case "randomAttack": {
                    randomAttack_listener(parsedData.data, ws)
                    Array.from(mainDatabase.keys()).forEach(pl => {
                        pl.send(updateWinners());
                        pl.send(updateRoomStatus())
                    })
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
                }
            }


        } catch (err) {
            if (err instanceof Error) {
                console.log(err.message)
                console.log(err.stack)
            }
            else console.log("Unknown Error")
        }
    });

});



export default wss;