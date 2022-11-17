// import {AccountBlacklist} from "../../models";
// import {Injectable} from '@nestjs/common';
// import {v4} from 'uuid';
// import {EntityRepository, EntityManager} from "typeorm";

// @EntityRepository()
// @Injectable()
// export class BlackListFacade {

//     constructor(private entityManager: EntityManager) {
//     }

//     async getAllBlackListsByAccountId(accountId, role) {
//         let request = this.entityManager.createQueryBuilder(AccountBlacklist, 'bl');
//         if (role !== 'admin') {
//             request.where('bl.accountId=:accountId', {accountId})
//         }
//         return await request.getMany();
//     }

//     async getBlackListsByNumberAccountId(accountId, number) {
//         return await this.entityManager.createQueryBuilder(AccountBlacklist, 'bl')
//             .where('bl.accountId=:accountId', { accountId })
//             .andWhere('bl.number=:number', { number })
//             .getMany();
//     }

//     async deletePhone({ accountId, role }, uuid: string, companyUuid: string) {
//         let delete_req = this.entityManager.createQueryBuilder()
//             .delete()
//             .from(AccountBlacklist)
//             .where('acbl_uuid=:uuid', { uuid })
//             .andWhere('company_uuid=:companyUuid', { companyUuid });

//         if (role !== 'admin') {
//             delete_req.andWhere('account_id=:accountId', { accountId });
//         }

//         return await delete_req.returning('*')
//             .execute();
//     }

//     async isBlackListExist(accountId, uuid) {
//         let manager = await this.entityManager;
//         return manager.createQueryBuilder(AccountBlacklist, 'abl')
//             .where('abl.account=:accountId', {accountId})
//             .andWhere('abl.uuid=:uuid', {uuid})
//             .getOne();
//     }

//     async create(currentUser, body: any) {
//         try {
//             if (!body.number) throw new Error('blacklist:youShouldPassNumber');
//             let reason = (body.reason) ? body.reason : 'no reason';
//             return await this.entityManager.createQueryBuilder()
//                 .insert()
//                 .into(AccountBlacklist)
//                 .values({
//                     uuid: await v4(),
//                     accountId: currentUser.accountID,
//                     // companyUuid: body.companyUuid,
//                     number: body.number,
//                     user: currentUser.userId,
//                     reason: reason,
//                     otherDetail: body.other_detail,
//                     status: true
//                 })
//                 .returning('*')
//                 .execute();
//         } catch (err) {
//             throw err;
//         }
//     }

//     async findById(id: number) {
//         let manager = await this.entityManager;
//         return manager.createQueryBuilder(AccountBlacklist, "bl")
//             .where("bl.id = :id ")
//             .setParameters({id})
//             .getOne();
//     }

//     async changeStatus(status, uuid, accountid) {
//         return await this.entityManager.createQueryBuilder()
//             .update(AccountBlacklist)
//             .set({
//                 status: status
//             })
//             .where('account_blacklist.acbl_uuid = :uuid', { uuid })
//             .andWhere('account_blacklist.account_id = :accountid', { accountid })
//             .returning('*')
//             .execute();
//     }
// }
