import { Contact, User, Account } from "../../models";
import { Injectable } from '@nestjs/common';
import { UserFacade } from '../facade/user.facade';
import {HelperClass} from "../../filters/Helper";

import { EntityRepository, EntityManager } from "typeorm";
import { AccountFacade } from "./account.facade";

@EntityRepository()
@Injectable()
export class CallerDetailsFacade {

    constructor(private entityManager: EntityManager,
                private userFacade: UserFacade,
                private accountFacade: AccountFacade
                ) { }

    async findByContactNumber(accountId: number, contNumber: string) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Contact, "cont")
            .leftJoinAndSelect("cont.account", "account")
            .where("account.id = :accountId ")
            .andWhere("cont.phoneNumber = :contNumber ")
            .setParameters({ accountId, contNumber })
            .getOne();
    }

    async get(currentUser, caller_number) {
        let user: any = await this.userFacade.getUserById(currentUser.userId, currentUser.accountId);
        if (!user) await HelperClass.throwErrorHelper('user:thisUserDoNotExist');
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        
        else {
            let contact: any = await this.findByContactNumber(account.id, caller_number);
            if (!contact) {
                contact = new Object();
                contact.type = 'Unknown';
                contact.phoneNumber = caller_number;
            }
            let npa, nxx;
            let manager = await this.entityManager;
            if (contact.phoneNumber.length == 11 && contact.phoneNumber.charAt(0) == '1') {
                npa = contact.phoneNumber.substring(1, 4);
                nxx = contact.phoneNumber.substring(5, 8);
                let result = await manager.query(`SELECT "State" FROM "public"."area" where "NPA"='${npa}' AND "NXX"='${nxx}';`)
                contact.area = result[0].State;
            }
            else if (contact.phoneNumber.length == 10) {
                npa = contact.phoneNumber.substring(0, 3);
                nxx = contact.phoneNumber.substring(3, 6);
                let result = await manager.query(`SELECT "State" FROM "public"."area" where "NPA"='${npa}' AND "NXX"='${nxx}';`)
                contact.area = result[0].State;
            }
            else {
                contact.area = 'Unknown';
            }
            return contact;
        }
    }

    async update(currentUser, caller_number, req_contact) {
        let user: any = await this.userFacade.getUserById(currentUser.userId, currentUser.accountId);
        if (!user) await HelperClass.throwErrorHelper('user:thisUserDoNotExist');
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        else {
            let contact: any = await this.findByContactNumber(account.id, caller_number);
            if (!contact) {
                return this.entityManager.createQueryBuilder()
                    .insert()
                    .into(Contact)
                    .values({
                        phoneNumber: caller_number,
                        firstName: req_contact.first_name,
                        lastName: req_contact.last_name,
                        active: true,
                        account: Account.withId(account.id),
                        modifiedBy: User.withId(currentUser.userId)
                    })
                    .returning('*')
                    .execute();
            }
            else {
                return this.entityManager.createQueryBuilder()
                    .update(Contact)
                    .set({
                        firstName: req_contact.first_name,
                        lastName: req_contact.last_name,
                        modifiedBy: User.withId(currentUser.userId),
                        lastModified: new Date()
                    })
                    .where('cont_id=:id', { id: contact.id })
                    .returning('*')
                    .execute();
            }
        }

    }
}