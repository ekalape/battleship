import Player from '../utils/Player';
import WebSocket from 'ws'

const singleplayDatabase: Map<WebSocket, Player> = new Map()

export default singleplayDatabase;