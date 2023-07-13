import { getAllNames } from '../database/mainDatabase';
import oldFellasDB from '../database/oldFellasDB';

export const nameValidation = (name: string, password: string) => {

    if (name.length < 5) throw new Error("The name should be at least 5 symbols long");
    if (password.length < 5) throw new Error("The password should be at least 5 symbols long");

    const allNames = getAllNames();
    if (allNames.includes(name)) {
        throw new Error("Name already in use")
    }

    const oldFellas = oldFellasDB.find(fel => fel.name === name)
    if (oldFellas) {
        if (oldFellas.password !== password) throw new Error("Name is known, but wrong password")
        else return oldFellas
    }

};
