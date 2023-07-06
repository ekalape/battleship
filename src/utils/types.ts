import WebSocket from 'ws';


export interface WebSocketClient extends WebSocket {
    id: number;
}
export interface IMessage {
    type: string | null,
    data: string,
    id: number
}

export interface IPlayer {
    name: string,
    index: number,
    room: number | null,
    currentGame: number | null,
    placedShips: boolean,
    ships: IShip[],
    matrix: string[][],
    turn: boolean,
    wins: number,
    ws: WebSocketClient

}

export type RegResponseType = {
    name: string,
    index: number,
    error: boolean,
    errorText: string
}

export type WinnersType = {
    name: string,
    wins: number
}

export type CreateGameType = {
    idGame: number,
    idPlayer: number,
}

export interface IRoom {
    roomId: number,
    roomUsers: Pick<IPlayer, "name" | "index">[]

}

export interface IShipPosition {
    x: number,
    y: number,
}

export interface IShip {
    position: IShipPosition,
    direction: boolean,
    length: number,
    type: "small" | "medium" | "large" | "huge",
}

export type ShipsType = {
    ships: IShip[]
}

export type AttackDataType = {
    position: IShipPosition,
    currentPlayer: number,
    status: "miss" | "killed" | "shot",
}