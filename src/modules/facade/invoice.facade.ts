import {Injectable} from '@nestjs/common';
import {MessageCodeError} from '../../util/error';

import {EntityRepository, EntityManager} from "typeorm";
import {Invoice} from "../../models/";

@EntityRepository()
@Injectable()
export class InvoiceFacade {

    constructor(private entityManager: EntityManager) {  }

    async getList(orderBy, orderType, offset=0, limit=10, email?) {
        let query = this.entityManager.createQueryBuilder(Invoice, 'inv')
                .leftJoinAndSelect("inv.payment", "payment")
                .leftJoinAndSelect("inv.user", "user");

        if (email){
            query.where('user.email like :userEmail', { userEmail: `%${email}%` });
        }

        if (!orderType || "ascending" === orderType) {
            query.orderBy(`inv.${orderBy}`, "ASC");
        } else if (!orderType || "descending" === orderType) {
            query.orderBy(`inv.${orderBy}`, "DESC");
        }

        query.offset(offset);
        query.limit(limit);
        return await query.getManyAndCount();
    }
}
