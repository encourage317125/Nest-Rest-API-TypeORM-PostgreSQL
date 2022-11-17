import {Config} from '../config';
import {JwtOptions, JWTClaims} from './interface';
import * as jwt from 'jsonwebtoken';
import constants from '../../constants';

export class JWTHelper {

    private static _options: JwtOptions = {
        algorithm: 'HS256',
        expiresIn: Config.param("JWT_EXPIRES", '2 days'),
        jwtid: Config.param("JWT_ID", "jsonwebtoken")
    };

    static async sign(claims: JWTClaims) {
        // return await jwt.sign(claims, Config.param("JWT_KEY", "CHANGEIT!!"), this._options);
        return await jwt.sign(claims, constants.JWT_KEY);
    }

    static async verify(token: string) {
        // return await jwt.verify(token, Config.param("JWT_KEY", "CHANGEIT!!"));
        return await jwt.verify(token, constants.JWT_KEY);
    }
}
