'use strict';

import { UserTypes } from "../../models/user.entity";

export interface JwtOptions {
    algorithm: string;
    expiresIn: number | string;
    jwtid: string;
}

export interface JWTClaims {
    userId: number;
    //accountId: number;
    companies?: number[];
    userFirstName?: string;
    userLastName?: string;
    //accountNumber: string;
    userAgent: string;
    nonce: string;
    userType?: UserTypes;
    remoteAddress: string;
    userEmail: string;
    //active: boolean;
    is_admin: boolean;
    opentactToken: string;
    userUuid: string;
}
