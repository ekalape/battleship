import playerDatabase from '../database/PlayerDatabase';
import database, { getAllNames } from '../database/database';

export const nameValidation = (name: string, password: string) => {

    if (name.length < 5) throw new Error("The name should be at least 5 symbols long");
    if (password.length < 5) throw new Error("The password should be at least 5 symbols long");

    const allNames = getAllNames();
    console.log(`allnames: ${JSON.stringify(allNames)} and user: ${name}`)
    if (allNames.includes(name)) {
        throw new Error("Name already in use")
    }

    return true;
};
