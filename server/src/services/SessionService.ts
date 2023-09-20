import DataProvider from "../utils/DataProviders"
import { CreateSessionData } from "../utils/types";


export const createRoomSession = (data: CreateSessionData ) => {
    try {
        const db = DataProvider.getDatabaseInstance();
        const session = db.session.create({
            data: data
        });
        return session;
    } catch (error) {
        console.log(error);
         throw(error)
    }

}
