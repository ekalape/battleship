import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { regHandler } from '../wsHandlers/regHandler';
import { IMessage } from '../utils/types';

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

wss.on('connection', function connection(ws) {
  const response: IMessage = { type: null, data: "", id: 0 };

  ws.on('error', console.error);

  ws.on('close', () => {
    console.log('closing ws');
  });

  ws.on('message', function message(data) {
    let resData: string;
    try {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "reg":
          response.type = "reg";
          resData = regHandler(parsedData.data);
          response.data = resData;
          break;
        default: {
          console.log("default case")
        }
      }

      ws.send(JSON.stringify(response))

    } catch (err) {
      console.log("Parsing error")
    }
  });

});
