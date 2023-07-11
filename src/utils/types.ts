import WebSocket from 'ws';



export interface IMessage {
    type: string | null,
    data: string,
    id: number
}

export type regRequestType = {
    name: string,
    password: string
}

export type RegResponseType = {
    name: string,
    index: number,
    error: boolean,
    errorText: string
}

export type CreateGameType = {
    idGame: number,
    idPlayer: number,
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

export type AddShipsType = {
    gameId: number,
    ships: IShip[],
    indexPlayer: number
}

export type AttackDataType = {
    position: IShipPosition,
    currentPlayer: number,
    status: "miss" | "killed" | "shot",
}