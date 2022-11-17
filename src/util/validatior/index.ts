//import {PipeTransform, Pipe, ArgumentMetadata} from '@nestjs/common';
import {PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';
import {validate} from 'class-validator';
import {plainToClass} from 'class-transformer';
import {MessageCodeError} from '../error';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {

    groups?: Array<String>;

    constructor(groups?: Array<String>) {
        this.groups = groups;
    }

    async transform(value, metadata: ArgumentMetadata) {
        const {metatype} = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        let metaValidate: any = {};
        let errors;
        if (this.groups && this.groups.length > 0) {
            metaValidate["groups"] = this.groups;
            errors = await validate(object, metaValidate);
        } else {
            errors = await validate(object);
        }

        if (errors.length > 0) {
            let msg = "";
            for (let err of errors) {

                for (let c in err.constraints) {
                    msg += err.property.toString() + "::" + err.constraints[c].toString() + "-- ";
                }
                if (!err.children) {
                    continue;
                }
                for (let children of err.children) {
                    for (let c in children.constraints) {
                        msg += err.property.toString() + "::" + children.constraints[c].toString() + "-- ";
                    }
                }
            }
            throw new MessageCodeError(msg);
        }
        return object;
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find((type) => metatype === type);
    }
}
