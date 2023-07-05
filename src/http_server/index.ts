import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { IMessage, RegResponseType } from '../utils/types';
import { updateRoomStatus } from '../wsHandlers/roomStatusHandler';
import roomDatabase from '../database/RoomDatabase';
import playerDatabase from '../database/PlayerDatabase';


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

wss.on('connection', function connection(ws: WebSocket) {

  const response: IMessage = { type: null, data: "", id: 0 };
  let playerData: RegResponseType | null = null;
  let gameId = 1;

  ws.on('error', console.error);

  ws.on('close', () => {
    console.log('closing ws');
  });

  ws.on('message', function message(data) {

    try {
      const parsedData = JSON.parse(data.toString());

      switch (parsedData.type) {
        case "reg":
          {
            response.type = "reg";

            playerData = regHandler(parsedData.data, ws);
            response.data = JSON.stringify(playerData);
            ws.send(JSON.stringify(response));

            if (roomDatabase.get().length === 0 || roomDatabase.get().every(r => r.roomUsers.length === 2)) {
              const roomId = roomDatabase.getNextNumber()
              roomDatabase.createRoom(roomId);
              roomDatabase.addPlayer(playerData.index, roomId)
            }
            ws.send(JSON.stringify(updateRoomStatus()))
            break;
          }

        case "create_room":
          {
            if (playerData) {
              const player = playerDatabase.getSinglePlayer(playerData.index)
              const roomId = roomDatabase.getNextNumber()
              roomDatabase.createRoom(roomId);
              roomDatabase.addPlayer(player.index, roomId);

              const freePlayers = playerDatabase.get().filter(pl => !pl.currentGame)
              freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))

            }
            break;
          }

        case "add_user_to_room":
          console.log(parsedData.data)
          if (playerData) {
            try {
              const parsedRoomInfo = JSON.parse(parsedData.data);
              const roomId = parsedRoomInfo?.indexRoom;
              roomDatabase.addPlayer(playerData.index, roomId)
              const freePlayers = playerDatabase.get().filter(pl => pl.room === roomId)
              freePlayers.forEach(pl => pl.ws.send(JSON.stringify(updateRoomStatus())))
            } catch (err) { throw new Error("Parsing error") }


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
