'use strict';

import "reflect-metadata";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { DispatchError } from './filters/DispatchError';
import { ApplicationModule } from './modules/app.module';
import { Config } from './util/config';
import * as swaggerUI from 'swagger-ui-express';
import * as cors from 'cors';
import * as path from 'path';
import * as raven from 'raven';

const cloneBuffer = require('clone-buffer');
const instance = express();

instance.use(bodyParser.json({
    verify: (req: any, res, buf, encoding) => {
      // important to store rawBody for Stripe signature verification
      if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
      	req.rawBody = cloneBuffer(buf);
      }
      return true;
    },
}));
// instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));
// instance.use(cors());
instance.use('/image', express.static(path.join(__dirname, '../../photo')));
instance.use('/audio', express.static(path.join(__dirname, '../../audio')));
instance.use('/xmls', express.static(path.join(__dirname, '../../xmls')));
if (process.env.NODE_ENV !== 'development') {
    raven.config(`${process.env.DNS}`).install();
    instance.use(raven.requestHandler());
}

let bootstrap = async () => {
    try {
        const app = await NestFactory.create(ApplicationModule, new ExpressAdapter(instance), { cors: true,});
        app.useGlobalFilters(new DispatchError());
        app.useGlobalPipes(new ValidationPipe());
        // app.useGlobalPipes(new ValidationPipe({whitelist: true,forbidNonWhitelisted:true}));
        if (process.env.NODE_ENV !== 'development') {
            await app.use(raven.errorHandler());
        }
        await instance.disable('x-powered-by');
        const swaggerOptions = new DocumentBuilder()
            .setTitle('Free Sms Backend')
            .setDescription('Endpoints used by free sms frontend')
            .setVersion('1.0.0')
            .addBearerAuth(
                { type: 'http', scheme: 'bearer', name: "Authorization", bearerFormat: 'JWT', in: "header", },
              )
            .build();
        let document = SwaggerModule.createDocument(app, swaggerOptions
        );

        await instance.get('/api-docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(document);
        });
        await instance.use('/swagger', swaggerUI.serve, swaggerUI.setup(document));
        await app.listen(Config.number("HTTP_PORT", 9090),
            Config.string("LISTEN_INTERFACE", "0.0.0.0"),
            () => console.log('Application is listening on port ' + Config.number("HTTP_PORT", 9090)));
    } catch (e) {
        console.log(e, 'error');
    }
};

bootstrap()
    .then((entity) => {
        return entity;
    })
    .catch((err) => {
        throw err;
    });

process.on('unhandledRejection', (reason) => {
    console.log(reason);
});
