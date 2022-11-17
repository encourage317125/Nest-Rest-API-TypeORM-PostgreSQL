import {errors} from '../static_errors/';
import * as fs from "fs";
import * as path from 'path';

let jsonPath = path.join(__dirname, '..', '..' ,  'timezones.json');
console.log('pathname', jsonPath)

export class HelperClass {

    static isUserAdmin(token) {
        if (token.is_admin) {
            return true;
        }
        throw new Error(`${errors.IS_ADMIN_USER}`);
    }

    static async throwErrorHelper(error) {
        throw new Error(`${error}`);
    }

    async callbackPromise() {
        return new Promise(async (resolve) => {
            await this.readJSONFile(jsonPath, (err, json) => {
                if (err) throw err;
                return resolve(json);
            });
        });
    }

    async callbackGetJson() {
        return await this.callbackPromise();
    }

    async readJSONFile(filename, callback) {
        fs.readFile(filename, (err, data: any) => {
            if (err) {
                callback(err);
                return;
            }
            try {
                callback(null, JSON.parse(data));
            } catch (exception) {
                callback(exception);
            }
        });
    }
}
