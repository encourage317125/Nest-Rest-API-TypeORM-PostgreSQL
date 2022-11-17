'use strict';

import { HttpStatus } from '@nestjs/common';

export interface ErrorMessage {
    type: string;
    httpStatus: HttpStatus;
    errorMessage: string;
    userMessage: string;
}
