export const responseCreator = (type: string, data: string) => {
    return JSON.stringify({
        type,
        data,
        id: 0
    })
};
