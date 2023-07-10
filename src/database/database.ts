import Player from '../utils/Player';
import WebSocket from 'ws'

const database: Map<WebSocket, Player> = new Map()


export default database;


export const findAvailable = () => {

    const result = Array.from(database.entries())
        .filter(([, value]) => value.currentGame === null)
        .map(([key]) => key);

    return result;
}

export const findWaiting = () => {

    const allRooms = Array.from(database.entries())
        .map(([, value]) => value.room);
    const roomMap = new Map();
    allRooms.forEach(r => {
        if (roomMap.has(r)) { roomMap.set(r, roomMap.get(r) + 1) }
        else roomMap.set(r, 1)
    })
    const singleRooms = Array.from(roomMap.entries()).filter(([, val]) => val === 1).map(r => r[0]).map(r => findByRoom(r)[0])

    return singleRooms;
}


export const getAllNames = () => {
    return Array.from(database.entries())
        .map(([, value]) => value.name);
}


export const findByRoom = (roomIndex: number) => {

    const result = Array.from(database.entries())
        .filter(([, value]) => value.room === roomIndex)
        .map(([key]) => key);

    return result;
}


export const findByIndex = (playerIndex: number) => {

    const result = Array.from(database.entries())
        .filter(([, value]) => value.index === playerIndex)
        .map(([key, value]) => ([key, value]));

    return result;
}


export const findByGame = (gameId: number) => {

    const result = Array.from(database.entries())
        .filter(([, value]) => value.currentGame === gameId)
        .map(([key]) => key);

    return result;
}

export const readyPlayers = (gameId: number) => {

    const result = Array.from(database.entries())
        .filter(([, value]) => value.currentGame === gameId && value.ships.length > 0)
        .map(([key]) => key);

    return result;
}

