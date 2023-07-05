import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { wsRequestHandler } from '../websocket/handler.js';

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
  let response;
  ws.on('error', console.error);

  ws.on('open', () => {
    console.log('open');
  });

  ws.on('message', function message(data) {
    response = wsRequestHandler(data);
    ws.send(response);
  });

  ws.send('something');
});
