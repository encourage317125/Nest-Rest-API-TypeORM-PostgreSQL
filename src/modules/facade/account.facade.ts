import { Account, User } from "../../models";
import { Injectable, Inject } from '@nestjs/common';
import { PasswordHelper } from '../../util/helper';
import { genSaltSync, hashSync } from 'bcrypt';
import { Config } from '../../util/config';
import { v4 } from 'uuid';
import { UserFacade } from './user.facade';
import { OpentactService } from '../opentact';
import { EntityRepository, EntityManager } from "typeorm";
import constants from "../../constants";
import { BaseService } from "../services/base.service";
import { TokensRepository } from '../db/repositories/tokens.repository';
const CryptoJS = require("crypto-js");
import { Transactional } from "typeorm-transactional-cls-hooked"
import { Repositories} from '../db/repositories';

@EntityRepository()
@Injectable()
export class AccountFacade extends BaseService {

    constructor(
        @Inject('Repositories')
        private readonly Repositories: Repositories, 
        private entityManager: EntityManager,
        private userFacade: UserFacade,
        private readonly opentactService: OpentactService) {
        super()
    }

    async getAll(orderBy, orderType, offset, limit) {
        let manager = await this.entityManager;
        let query1 = `SELECT count(*) FROM "public"."account" "account" 
                    LEFT JOIN "user" "user" ON "user"."account_id" = "account"."acco_id"`;
        let count = await manager.query(query1);

        let query2 = `SELECT to_char("account"."acco_creation", 'YYYY-MM-DD') AS "registered_on", "user"."email_confirmed" AS "emailConfirmed", 
                    "user"."user_email" AS "email", to_char("user"."user_last_login", 'YYYY-MM-DD') AS "last_login", "user"."user_id" AS "user_id" , "account"."acco_id" AS "account_id", "account"."acco_status" AS "account_status"
                    FROM "public"."account" "account" LEFT JOIN "user" "user" ON "user"."account_id" = "account"."acco_id" `;

        if (orderBy) {
            if (!orderType || "ascending" === orderType) {
                query2 += `ORDER BY ${orderBy} ASC`;
            } else if (!orderType || "descending" === orderType) {
                query2 += `ORDER BY ${orderBy} DESC`;
            }
        }

        query2 += ' LIMIT $1 OFFSET $2'

        let result = await manager.query(query2, [limit, offset]);
        return [result, Number(count[0].count)]
    }

    async findById(accoId: number) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Account, "account")
            .where("account.id = :accoId ")
            .setParameters({ accoId })
            .getOne();
    }

    async findByUuid(uuid: string) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(Account, "account")
            .where("account.number = :uuid ")
            .setParameters({ uuid })
            .getOne();
    }

    public async saveToken(login: string, password: string, user: User): Promise<unknown> {
        const domain = constants.OPENTACT_SIP_DOMAIN
        const ha1 = CryptoJS.MD5(
            `${login}:${domain}:${password}`
        ).toString();
        const ha1b = CryptoJS.MD5(
            `${login}@${domain}:${domain}:${password}`
        ).toString();
        return await this.createEntity(this.Repositories.TOKEN, { user, ha1, ha1b })
    }

    @Transactional()
    async createUser(us: User) {
        let user = new User();
        user.email = us.email;
        user.firstName = us.firstName;
        user.lastName = us.lastName;
        user.password = us.password;
        // user.isAdmin = us.isAdmin;
        // user.userLastLogin = us.userLastLogin;
        //user.accountID = us.accountID;
        user.creation = new Date();
        user.updated = new Date();
        await PasswordHelper.validatePassword(user.password);
        const found = await this.userFacade.findByEmail(user.email);
        if (found) throw new Error('user:alreadyExists');
        const salt = genSaltSync(Config.number("BCRYPT_SALT_ROUNDS", 10));
        user.password = await hashSync(user.password, salt);
        user.salt = salt;
        user.userIdentityOpenTact = false;
        user.uuid = v4();
        user.plaintText = true;
        user.invoiceEmail = false;
        user.emailConfirmed = true;
        user.active = true;
        const login = `${user.firstName}_${user.lastName}_${Date.now()}`;
        user.sipUsername = login;
        const userEntity = await user.save();
        if (us.password) {
            const createdTokens = await this.saveToken(login, us.password, userEntity)
        }
        const sipUser = await this.opentactService.createSipUser({
            login,
            password: us.password,
        })
        return userEntity
    }

    async changeAccount(account) {
        let manager = await this.entityManager;
        return await manager.save(account);
    }

    async disableEnableDid(id, enable) {
        return this.entityManager.createQueryBuilder()
            .update(Account)
            .set({
                status: enable
            })
            .where('id=:id', { id })
            .returning('*')
            .execute();
    }
}