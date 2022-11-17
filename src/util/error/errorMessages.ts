'use strict';

import { HttpStatus } from '@nestjs/common';
import { ErrorMessage } from './error';

export const errorMessagesConfig: { [messageCode: string]: ErrorMessage } = {
    'request:unauthorized': {
        type: 'unauthorized',
        httpStatus: HttpStatus.UNAUTHORIZED,
        errorMessage: 'Access unauthorized.',
        userMessage: 'Access unauthorized.'
    },
    'auth:signup:missingFirstName': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user without first name.',
        userMessage: 'Bad Request'
    },
    'auth:signup:missingLastName': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user without first name.',
        userMessage: 'Bad Request'
    },
    'auth:signup:missingEmail': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user without email.',
        userMessage: 'Bad Request'
    },
    'auth:signup:missingPassword': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user without password.',
        userMessage: 'Bad Request'
    },
    'auth:signup:missinRePassword': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user without password confirmation.',
        userMessage: 'Bad Request'
    },
    'auth:signup:passwordMatch': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user. password not match.',
        userMessage: 'Bad Request'
    },
    'user:passwordStrength': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'the password Strength  is incorrect.',
        userMessage: 'Bad Request'
    },
    'user:alreadyExists': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user. User already exists.',
        userMessage: 'Bad Request'
    },
    'user:tokenError': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to create the user. could not create token.',
        userMessage: 'Bad Request'
    }, 'user:notFound': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Wrong email or password',
        userMessage: 'Bad Credentials'
    }, 'BadRequest': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Bad Request',
        userMessage: 'Bad Request'
    },
    'Unauthorized': {
        type: 'Unauthorized',
        httpStatus: HttpStatus.UNAUTHORIZED,
        errorMessage: 'Unauthorized',
        userMessage: 'Unauthorized'
    },
    'DuplicateInfo': {
        type: 'DuplicateInfo',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'DuplicateInfo',
        userMessage: 'DuplicateInfo'
    },
    'profile:passwordMatch': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to edit the user. password not match',
        userMessage: 'Bad Request'
    },
    'profile:imageType': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to edit the user. the image format is incorrect',
        userMessage: 'Bad Request'
    },
    'profile:imageSize': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to edit the user. maximum file length exceeded',
        userMessage: 'Bad Request'
    },
    'profile:imageError': {
        type: 'BadRequest',
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage: 'Unable to edit the user. error uploading image',
        userMessage: 'Bad Request'
    }
};
