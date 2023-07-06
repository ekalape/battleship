export const changeTurnHandler = (currentPlayerIndex: number) => {
    const data = JSON.stringify({
        currentPlayer: currentPlayerIndex
    })
    const response = JSON.stringify({
        type: "turn",
        data,
        id: 0,
    })
    return response;
}