import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { IMessage, RegResponseType, WebSocketClient } from '../utils/types';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';
import roomDatabase from '../database/RoomDatabase';
import playerDatabase from '../database/PlayerDatabase';
import { countID } from '../utils/countID';
import { createGame } from '../wsHandlers/createGame';
import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';
import { startGame } from '../wsHandlers/startGame';
import { changeTurnHandler } from '../wsHandlers/changeTurnHandler';
import { shipsToMatrix } from '../utils/shipsToMatrix';
import { attackHandler } from '../wsHandlers/attackHandler'




export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);

  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

const wss = new WebSocketServer({ server: httpServer });
let gameID = countID();
let roomCount = countID();
let playerCount = countID();


wss.on('connection', function connection(ws: WebSocketClient) {
  console.log(`WebSocket is connected on port ${process.env.PORT || 3000}`)

  const response: IMessage = { type: null, data: "", id: 0 };
  let playerData: RegResponseType | null = null;


  ws.on('error', console.error);

  ws.on('close', () => {
    try {

      if (playerData) {
        playerDatabase.delete(playerData.index);
        roomDatabase.removePlayer(playerData.index)
      }
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

      switch (parsedData.type) {
        case "reg":
          {
            response.type = "reg";
            const socketIndex = playerCount()
            ws.id = socketIndex
            playerData = regHandler(socketIndex, parsedData.data, ws);
            response.data = JSON.stringify(playerData);
            ws.send(JSON.stringify(response));
            const roomId = roomCount()
            roomDatabase.createRoom(roomId);
            roomDatabase.addPlayer(playerData.index, roomId)
            console.log(`room ${roomId} created, player ${playerData.index} added`)
            const freePlayers = playerDatabase.get().filter(pl => !pl.currentGame)
            freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
            break;
          }

        case "create_room":
          {
            if (playerData) {
              const roomId = roomCount()
              roomDatabase.createRoom(roomId);
              addPlayerToRoom(playerData.index, roomId)
              console.log(`room ${roomId} created, player ${playerData.index} added`)
              const freePlayers = playerDatabase.get().filter(pl => !pl.currentGame)
              freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
            }
            break;
          }

        case "add_user_to_room":
          console.log(parsedData.data)
          if (playerData) {
            const parsedRoomInfo = JSON.parse(parsedData.data);
            const roomId = parsedRoomInfo?.indexRoom;
            const ready = addPlayerToRoom(playerData.index, roomId)
            if (ready) {
              const readyPlayers = playerDatabase.get().filter(pl => pl.room === roomId)
              const gameid = gameID()
              console.log("gameid started", gameid)
              console.log(`players:  ${readyPlayers[0].name} and ${readyPlayers[1].name} from room ${roomId}`)
              const freePlayers = playerDatabase.get().filter(pl => !pl.currentGame)
              freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
              readyPlayers[0].ws.send(createGame(gameid, readyPlayers[1]));
              readyPlayers[1].ws.send(createGame(gameid, readyPlayers[0]));
            }
            else {
              const freePlayers = playerDatabase.get().filter(pl => !pl.currentGame)
              freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
            }
          }
          break;

        case "add_ships": {
          console.log("type add_ships", parsedData.type)
          //console.log(parsedData.data)
          const gamedata = JSON.parse(parsedData.data)
          const player = playerDatabase.getSinglePlayer(gamedata.indexPlayer);
          player.ships = gamedata.ships;
          player.matrix = shipsToMatrix(player.ships);

          player.placedShips = true;
          console.log(`player ${player.index} placed -->  ${player.placedShips}`)
          const gameId: number = gamedata.gameId;
          const players = playerDatabase.get().filter(pl => pl.currentGame === gameId)
          console.log("players >>> ", players[0].index, players[1].index)
          if (players.length !== 2) throw new Error("Game error")
          //  const turn = turnCount()
          players[0].turn = true;
          if (players.every(pl => pl.placedShips)) {
            players[0].ws.send(startGame(players[0]));
            players[1].ws.send(startGame(players[1]));
            const turnResponse = changeTurnHandler(gameId)
            players.forEach(pl => pl.ws.send(turnResponse))
          }
          break;
        }

        case "attack": {
          console.log(`attackData ==> ${parsedData.data}`)
          const attackData = JSON.parse(parsedData.data);
          const { x, y, gameId, indexPlayer } = attackData;

          const players = playerDatabase.get().filter(pl => pl.currentGame === gameId);

          if (players.find(pl => pl.turn === true)?.index !== indexPlayer) {

            console.log(`\n now break`)
            break
          };

          const response = attackHandler({ x, y }, gameId, indexPlayer)
          console.log(`response attack >>> `, response)
          const turnResponse = changeTurnHandler(gameId)
          players.forEach(pl => {
            pl.ws.send(response);
            pl.ws.send(turnResponse);
          })
          break;
        }
        default: {
          console.log("default case type", parsedData.type);

          // console.log(parsedData.data);
        }
      }



    } catch (err) {
      if (err instanceof Error)
        console.log(err.message)
      else console.log("Unknown Error")
    }
  });

});


