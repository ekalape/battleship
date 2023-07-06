import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { IMessage, RegResponseType } from '../utils/types';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';
import roomDatabase from '../database/RoomDatabase';
import playerDatabase from '../database/PlayerDatabase';
import { countID } from '../utils/countID';
import { createGame } from '../wsHandlers/createGame';
import { addPlayerToRoom } from '../wsHandlers/addPlayerToRoom';


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

wss.on('connection', function connection(ws: WebSocket) {

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
            playerData = regHandler(playerCount(), parsedData.data, ws);
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
        default: {
          console.log("default case");
          console.log("type", parsedData.type);
          console.log(parsedData.data);
        }
      }



    } catch (err) {
      if (err instanceof Error)
        console.log(err.message)
      else console.log("Unknown Error")
    }
  });

});
