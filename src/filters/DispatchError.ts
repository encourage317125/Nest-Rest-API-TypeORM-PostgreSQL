'use strict';

//import {HttpException} from '@nestjs/core';
import { Catch, ExceptionFilter, HttpStatus, ArgumentsHost, HttpException } from '@nestjs/common';
import { MessageCodeError } from '../util/error';

@Catch(MessageCodeError, HttpException, Error)
export class DispatchError implements ExceptionFilter {
    public catch(err, host: ArgumentsHost) {
        console.error(err)
        let res = host.switchToHttp().getResponse();
        if (err instanceof MessageCodeError) {
            res.setHeader('Access-Control-Expose-Headers', 'x-message-code-error, x-message, x-httpStatus-error');
            // res.setHeader('x-message-code-error', err.messageCode);
            res.setHeader('x-message', err.message);
            res.setHeader('x-httpStatus-error', err.httpStatus);
            return res.status(err.httpStatus).send({
                error: err.message,
                message: err.messageCode
            });
        }
        if (err instanceof HttpException) {
            res.setHeader('Access-Control-Expose-Headers', 'x-message-code-error, x-message, x-httpStatus-error');
            res.setHeader('x-message-code-error', err.getResponse());
            res.setHeader('x-message', err.getResponse());
            res.setHeader('x-httpStatus-error', err.getStatus());
            return res.status(err.getStatus()).send({
                error: err.getResponse(),
                message: err.getResponse()
            });
        }
        if (err.response.data) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: err.response.data,
                message: err.message
            });
        } else if (err.message === '404') {
            return res.status(404).json({
                success: false,
                message: "Object not found"
            })

        } else {
            // console.log(res,'status')
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: err.message,
                message: err.message
            });
        }
    }
}
