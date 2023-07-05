import { httpServer } from './src/http_server/';

//const HTTP_PORT = 8181;
const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
