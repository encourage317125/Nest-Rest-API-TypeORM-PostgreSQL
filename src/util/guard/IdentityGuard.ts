//import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs';

@Injectable()
export class IdentityGuard implements CanActivate {
    //canActivate(dataOrRequest, context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        //console.log("IdentityGuard", dataOrRequest.user);
        console.log("IdentityGuard", user);
        if (!user.isIdentity) {
            return false;
        }
        // console.log("context", context);
        return true;
    }
}