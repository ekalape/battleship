const countID = () => {
    let id = 0;
    return function () { return ++id }
}

export const gameID = countID();
export const roomCount = countID();
export const playerCount = countID();