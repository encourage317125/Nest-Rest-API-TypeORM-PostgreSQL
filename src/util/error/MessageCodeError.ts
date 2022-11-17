'use strict';

import {errorMessagesConfig} from './errorMessages';
import {ErrorMessage} from './error';

export class MessageCodeError extends Error {
    public messageCode: string;
    public httpStatus: number;
    public errorMessage: string;

    constructor(messageCode: string) {
        super();

        const errorMessageConfig = this.getMessageFromMessageCode(messageCode);
        if (!errorMessageConfig) throw new Error('Unable to find message code error.');

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.httpStatus = errorMessageConfig.httpStatus;
        this.messageCode = messageCode;
        this.errorMessage = errorMessageConfig.errorMessage;
        this.message = errorMessageConfig.userMessage;
    }

    private getMessageFromMessageCode(messageCode: string): ErrorMessage {
        let errorMessageConfig: ErrorMessage | undefined;
        Object.keys(errorMessagesConfig).some(key => {
            if (key === messageCode) {
                errorMessageConfig = errorMessagesConfig[key];
                return true;
            }
            return false;
        });

        if (!errorMessageConfig) {
            errorMessageConfig = errorMessagesConfig["BadRequest"];
        }
        return errorMessageConfig;
    }
}
