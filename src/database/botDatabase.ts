import Player from '../utils/Player';
import WebSocket from 'ws'

let botDatabase: Player[] = []

export default botDatabase;

export const deleteBot = (botIndex: number) => {
    botDatabase = botDatabase.filter(b => b.index !== botIndex)
};
