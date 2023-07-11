import Player from '../utils/Player';
import WebSocket from 'ws'

const mainDatabase: Map<WebSocket, Player> = new Map()

export default mainDatabase;

export const findWaiting = (full: boolean) => {
    const allRooms = Array.from(mainDatabase.entries())
        .filter(([, value]) => value.singleplay === false)
        .map(([, value]) => value.room);

    const roomMap = new Map();

    allRooms.forEach(r => {
        if (r !== null) {
            if (!roomMap.has(r)) {
                roomMap.set(r, 1);
            }
            else {
                roomMap.set(r, roomMap.get(r) + 1);

            }
        }
    })
    const singleRooms = Array.from(roomMap.entries()).filter(([, val]) => val === 1).map(r => r[0]).map(r => findByRoom(r)[0])
    const fullRooms = Array.from(roomMap.entries()).filter(([, val]) => val === 2).map(r => r[0]).map(r => findByRoom(r)[0])
    return full ? fullRooms : singleRooms;
}


export const getAllNames = () => {
    return Array.from(mainDatabase.entries())
        .map(([, value]) => value.name);
}


export const findByRoom = (roomIndex: number) => {
    const result = Array.from(mainDatabase.entries())
        .filter(([, value]) => value.room === roomIndex)
        .map(([key]) => key);

    return result;
}


export const findByIndex = (playerIndex: number) => {
    const result = Array.from(mainDatabase.entries())
        .filter(([, value]) => value.index === playerIndex)
        .map(([ws, pl]) => ({ ws, pl }));

    return result;
}


export const findByGame = (gameId: number) => {
    const result = Array.from(mainDatabase.entries())
        .filter(([, value]) => value.currentGame === gameId)
        .map(([key]) => key);

    return result;
}


