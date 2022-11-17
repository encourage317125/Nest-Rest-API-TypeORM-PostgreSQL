'use strict';

import { Injectable, NestMiddleware, HttpStatus, } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JWTHelper } from '../util/jwt';
import { HelperClass } from "./Helper";
import { errorResponse } from "./errorRespone";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    //resolve() {
    async use(req, res: Response, next: NextFunction) {
        //return async function (req, res: Response, next: NextFunction) {
        try {
            let url = req.originalUrl || req.path || req.url;
            if (url.includes("auth/login")
                || url.includes("auth/signup") && req.method !== 'PATCH'
                || url.includes("api-docs.json")
                || url.includes("swagger")
                || url.includes("favicon.ico")
                || url.includes("freeswitch/dialplan")
                || url.includes("public/timezone/list")
                || url.includes("public/number_search")
                || url.includes("public/verify_token")
                || url.includes("public/list/npa")
                || url.includes("public/assets")
                || url.includes("dynamic_number")
                || url.includes("auth/change/password")
                || url.includes("auth/reset/password")
                || url.includes("did/xml")
                || url.includes("auth/activate")
                || url.includes("opentact/dialplan")
                || url.includes("opentact/call_status_callback")
                || url.includes("call/menu-step-xml")
                || url.includes("sms/webhook")
                || url.includes("/tracking_numbers/search/by")
                || url.includes("/tracking_numbers/random/long_code")
                || url.includes("/tracking_numbers/random/toll_free")
                || url.includes("/opentact/call_flow/callback")
                || url.includes("/tracking_numbers/provinces/list")
                || url.includes("/payments/payment_approval_url")
                || url.includes("/socket.io")
                || url === "/"
                || url === "/tracking_numbers"
                || url === '/payments/create_payments'
                || url === '/payments/execute_paypal_payments'
                || url === '/payments/execute_stripe_payments'
                || url === '/opentact/sms/sent_callback'
                || url === '/opentact/sms/get_callback'
            ) {
                if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {

                    let token = (req.headers.authorization as string).split(' ')[1];
                    const user: any = await JWTHelper.verify(token);
                    user.role = user.is_admin ? 'admin' : 'dev';
                    req.user = user;
                }
                next();
                return;
            }
            if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
                try {
                    let token = (req.headers.authorization as string).split(' ')[1];
                    const user: any = await JWTHelper.verify(token);
                    
                    if (user.is_admin) {
                        let adminToken: any = user.opentactToken;
                        let date = parseInt(`${Date.now() / 1000}`);
                        if (date > adminToken.exp) {
                            await HelperClass.throwErrorHelper('token:expired');
                        }
                    }
                    if (!user || !user.userId /* || !user.accountId */) {
                        await HelperClass.throwErrorHelper('request:unauthorized');
                    }
                    /* if (!user.active) {
                        await HelperClass.throwErrorHelper('user:inactivated');
                    } */
                    user.role = user.is_admin ? 'admin' : 'dev';
                    req.user = user;
                    next();
                } catch (e) {
                    errorResponse(res, e.message, HttpStatus.BAD_REQUEST);
                }

            } else {
                errorResponse(res, 'request:youShouldPassCorrectToken', HttpStatus.BAD_REQUEST);
            }
        } catch (err) {
            errorResponse(res, 'request:youShouldPassCorrectToken', HttpStatus.BAD_REQUEST);
        }
        //};
    }
}
