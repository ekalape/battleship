export const countID = () => {
    let id = 0;
    return function () { return ++id }
}