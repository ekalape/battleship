export interface IMessage {
    type: string | null,
    data: string,
    id: number
}

export interface Player {
    name: string,
    index: number,
    insideRoom: boolean,
    room: number | null,
    currentGame: number | null
}

export type regResponse = {
    name: string,
    index: number,
    error: boolean,
    errorText: string
}