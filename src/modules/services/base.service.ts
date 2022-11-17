import { Inject } from '@nestjs/common';
import { UsersRepository } from '../db/repositories/users.repository';
import { AccountsRepository } from '../db/repositories/accounts.repository';
import { DidsRepository } from '../db/repositories/did.repository';
import { TokensRepository } from '../db/repositories/tokens.repository';
import { PaymentsRepository } from '../db/repositories/payments.repository'
// import { PlansRepository } from '../db/repositories/plan.repository';
import { BaseAbstractRepository } from '../db/repositories/base.abstract.repository';

// export enum Repositories {
//     ACCOUNTS = "accountsRepository",
//     PAYMENTS = "paymentsRepository",
//     USERS = "usersRepository",
//     DID = "didRepository",
//     TOKEN = 'tokensRepository',
//     CALL_FLOW = 'callFlowsRepository',
//     PLAN = 'plansRepository',
//     COUNTRY = 'countrysRepository',
//     PROVINCE = 'provincesRepository',
//     BLACKLISTS = 'blacklistsRepository',
// }

export interface getEntities {
    page:number,
    pageSize: number,
    where:any,
    relations?:string[],
    join?:any,
  }

export class BaseService {

    public async createEntity<T>(repository: BaseAbstractRepository<T>, body: any): Promise<T> {
        try {
            return await repository.create(
                body
            );
        } catch (err) {
            console.log(err);
            throw err
        }
    }

    public async getEntity<T>(repository: BaseAbstractRepository<T>, where, relations?, join?): Promise<any> {
        const entity = await repository.findOne({
            relations,
            where,
            join
        });
        if (!entity) {
            throw new Error("404");
        }

        return entity;
    }



    public async updateEntity<T>(repository: BaseAbstractRepository<T>,
        where: object,
        body: any,
    ): Promise<T> {
        try {
            const entity = await this.getEntity(repository, where)
            console.log(...entity, ...body);
            return await repository.update({
                ...entity,
                ...body
            });

        } catch (err) {
            console.log(err);
            throw err
        }
    }



    public async getEntities<T>(repository: BaseAbstractRepository<T>, {
        page,
        pageSize,
        where,
        relations=undefined,
        join = undefined,
    }:getEntities, order: any = undefined,): Promise<any> {
        const take = pageSize;
        const skip = take && page && (page - 1) * take;
        return await repository.find({
            relations,
            where,
            join,
            take,
            skip,
            order,

        });
    }

    public async deleteEntity<T>(repository: BaseAbstractRepository<T>, where): Promise<T> {
        return await repository.delete(where);
    }

}