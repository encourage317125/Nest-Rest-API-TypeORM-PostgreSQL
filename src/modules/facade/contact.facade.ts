import { Contact, User } from "../../models";
import { Injectable } from '@nestjs/common';
import {HelperClass} from "../../filters/Helper";
import {ContactReq} from "../../util/swagger/contact_req";

import { EntityRepository, EntityManager } from "typeorm";
import { AccountFacade } from "./account.facade";

@EntityRepository()
@Injectable()
export class ContactFacade {

    constructor(private entityManager: EntityManager,
                private accountFacade: AccountFacade
                ) { }

    async findById(accoId: number, contId: number) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Contact, "cont")
            .leftJoinAndSelect("cont.account", "account")
            .where("account.id = :accoId ")
            .andWhere("cont.id = :contId ")
            .setParameters({ accoId, contId })
            .getOne();
    }

    async findByAccountId(accoId: number, number: string) {
        let request = this.entityManager.createQueryBuilder(Contact, "cont")
            .leftJoinAndSelect("cont.account", "account")
            .where("account.id = :accoId", { accoId });

        if (number) request.andWhere("cont.cont_phone_number LIKE :phone", { phone: `%${number}%` });

        return await request.getManyAndCount();
    }

    async create(currentUser, contact_req: ContactReq) {
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        let contact = new Contact();
        contact.phoneNumber = contact_req.phoneNumber;
        contact.firstName = contact_req.firstName;
        contact.lastName = contact_req.lastName;
        contact.createdOn = new Date();
        contact.lastModified = new Date();
        contact.active = contact_req.active;
        contact.modifiedBy = User.withId(currentUser.userId);
        if (account)        
            contact.account = account;
        let manager = await this.entityManager;
        return await manager.save(contact);

    }

    async edit(currentUser, id, contact_req: ContactReq) {
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        else {
            let contact = await this.findById(account.id, id);
            if (!contact) await HelperClass.throwErrorHelper('contact:ContactDoesNotExist');
            else  {
                contact.phoneNumber = contact_req.phoneNumber;
                contact.firstName = contact_req.firstName;
                contact.lastName = contact_req.lastName;
                contact.lastModified = new Date();
                contact.active = contact_req.active;
                contact.modifiedBy = User.withId(currentUser.userId);
                let manager = await this.entityManager;
                return await manager.save(contact);
            }
        }
    }

    async get(currentUser, id) {
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        else {
            let contact = await this.findById(account.id, id);
            if (!contact) await HelperClass.throwErrorHelper('contact:ContactDoesNotExist');
            else
                return contact;
        }
    }

    async getList(currentUser, number) {
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        else {
            return await this.findByAccountId(account.id, number);
        }
    }

    async delete(currentUser, id) {
        let account = await this.accountFacade.findById(currentUser.accountId);
        if (!account) await HelperClass.throwErrorHelper('account:AccountDoesNotExist');
        else {
            let contact = await this.findById(account.id, id);
            if (!contact) await HelperClass.throwErrorHelper('contact:ContactDoesNotExist');
            let manager = await this.entityManager;
            return manager.query("delete from contacts where account_id=$1 and cont_id=$2", [account.id, id])
        }
    }
}