import { AccountNumber, Did } from "../../models";
import { Injectable } from '@nestjs/common';

import { EntityRepository, EntityManager } from "typeorm";
import { OpentactService } from "../opentact";
import { DidFacade } from "./did.facade";
import { HelperClass } from "../../filters/Helper";
import { AccountNumberReq } from "../../util/swagger/account_number"
import { Constants } from "../../util/constants/index";

@EntityRepository()
@Injectable()
export class AccountNumberFacade {

    constructor(
        private entityManager: EntityManager,
        private opentactService: OpentactService,
        private didFacade: DidFacade) {
    }

    async getTrackingNumbers(userID, accountID, id, isAll=true, orderBy='registerDate', orderType='descending', offset=0, limit=10, filter='') {
        let query = this.entityManager.createQueryBuilder(AccountNumber, 'an')
            .where('an.userID=:userID', { userID: userID })
            .andWhere('an.accountID=:accountID', { accountID: accountID })
            .leftJoinAndSelect("an.did", "did")
            .leftJoinAndSelect("an.callFlow", "callFlow")
        if (id) {
            query.andWhere('an.id=:id', { id: id });
        }

        if (filter && filter.trim()) {
            query.andWhere(" (lower(an.poolName) like lower(:filter) OR lower(an.visitorFrom) like lower(:filter) OR an.number::varchar like :filter OR an.destination_number::varchar like :filter )  ");
            query.setParameter("filter", "%" + filter + "%");
        }

        if (!orderType || "ascending" === orderType) {
            query.orderBy(`an.${orderBy}`, "ASC");
        } else if (!orderType || "descending" === orderType) {
            query.orderBy(`an.${orderBy}`, "DESC");
        }

        if(!isAll) {
            query.offset(offset);
            query.limit(limit);
        }

        return query.getManyAndCount();
    }

    async getTrackingNumberBy(userID, accountID, search) {
        let s = (typeof search === 'string') ? parseInt(search) : search;
        return this.entityManager.query(`select * from tracking_numbers where acco_id=$1 and user_id=$2 AND number::text like '${s}%' OR pool_name like '${search}%' OR destination_number::text like '${s}%'`,
            [accountID, userID]);
    }

    async getUserAccountTrackingNumbers(userID, accountID) {
        return (await this.entityManager.query(`SELECT ARRAY (SELECT number FROM tracking_numbers WHERE acco_id=${accountID} AND user_id=${userID})`))[0].array;
    }

    async delete(id, currentUser) {
        let manager = await this.entityManager;
        return await manager.transaction(async tEM => {
            let trackingNumber = await this.getTrackingNumberById(id, currentUser.userId, currentUser.accountId);
            if (!trackingNumber) throw new Error('tracking_number:thisTrackingNumberDoesNotExist');
            let did = trackingNumber.did;
            if (id)
                await tEM.query("delete from tracking_numbers where id = $1", [id]);
            if (did && did.id)
                await tEM.query("delete from did where did_id = $1", [did.id]);
            let token = await this.opentactService.adminLoginGettignToken();
            if (did && did.didOpentactIdentityID)
                await this.opentactService.releaseAppDid(token.token, did.didOpentactIdentityID);
        })
    }

    async deleteTrackingNumber(id, userID, accountID) {
        return this.entityManager.createQueryBuilder()
            .delete()
            .from(AccountNumber)
            .where('id=:id', { id: id })
            .andWhere('userID=:userID', { userID: userID })
            .andWhere('accountID=:accountID', { accountID: accountID })
            .returning('*')
            .execute();
    }

    async disableEnable(id, currentUser, status) {
        let trackingNumber = await this.getTrackingNumberById(id, currentUser.userId, currentUser.accountId);
        if (!trackingNumber) throw new Error('tracking_number:thisTrackingNumberDoesNotExist');
        return await this.disableEnableDb(id, currentUser.userId, currentUser.accountId, status);
    }

    async disableEnableDb(id, userID, accountID, status) {
        return this.entityManager.createQueryBuilder()
            .update(AccountNumber)
            .set({
                status: status
            })
            .where('id=:id', { id: id })
            .andWhere('userID=:userID', { userID: userID })
            .andWhere('accountID=:accountID', { accountID: accountID })
            .returning('*')
            .execute();
    }

    async getTrackingNumberById(id, userID, accountID) {
        return this.entityManager.createQueryBuilder(AccountNumber, 'an')
            .where('an.id=:id', { id: id })
            .andWhere('an.userID=:userID', { userID: userID })
            .andWhere('an.accountID=:accountID', { accountID: accountID })
            .leftJoinAndSelect('an.did', 'did')
            .getOne();
    }

    async isDidExistInReturnedList(didEntitiesList, didID) {
        let arr: any = [];
        for (let i = 0; i < didEntitiesList.length; i++) {
            for (let j = 0; j < didEntitiesList.length; j++) {
                if (didEntitiesList[i][j]) {
                    if (didID === didEntitiesList[i][j].id) {
                        return arr.push(didEntitiesList[i][j].id);
                    }
                }
            }
        }
        if (arr.length !== 0) return true;
        return false;
    }

    async isMoreThenOneField(body) {
        let arr: Array<string> = [];
        if (body.search) arr.push('search');
        if (body.webRef) arr.push('webRef');
        if (body.lendPage) arr.push('lendPage');
        if (body.lendParams) arr.push('lendParams');
        if (body.direct) arr.push('direct');
        if (body.alwaysSwap) arr.push('alwaysSwap');
        if (arr.length > 1) await HelperClass.throwErrorHelper('tracking_number:youShouldPassOneFromNextFields(alwaysSwap,direct,lendParams,lendPage,webRef,search)');
        return arr;
    }

    async getObjectForSavingTrackingNumberPatch(body, userID, accountID, trackingNumberEntityOld, numberField, isCountCorrect) {
        return {
            id: body.id,
            didID: body.didID ? body.didID : trackingNumberEntityOld.didID,
            userID,
            accountID,
            recordCalls: body.recordCalls ? body.recordCalls : trackingNumberEntityOld.recordCalls,
            recordCallsBoolean: body.recordCallsBoolean ? body.recordCallsBoolean : trackingNumberEntityOld.recordCallsBoolean,
            whisperMessage: (body.whisperMessage) ? body.whisperMessage : (trackingNumberEntityOld.whisperMessage),
            whisperMessageBoolean: (body.whisperMessageBoolean) ? body.whisperMessageBoolean : trackingNumberEntityOld.whisperMessageBoolean,
            number: numberField ? numberField : body.number,
            visitorFor: (isCountCorrect && isCountCorrect.length > 0) ? (body.search) ? body.visitorFor : null
                : body.visitorFor ? trackingNumberEntityOld.search ? body.visitorFor : await HelperClass.throwErrorHelper('did:youCanNotChangeFieldvisitorForBecauseYourCurrentFieldSearchAreNotTrue')
                    : trackingNumberEntityOld.visitorFor,
            visitorFrom: (body.visitorFrom) ? body.visitorFrom : trackingNumberEntityOld.visitorFrom,
            alwaysSwap: (body.alwaysSwap != undefined && body.alwaysSwap != null) ? body.alwaysSwap : trackingNumberEntityOld.alwaysSwap,
            direct: (body.direct != undefined && body.direct != null) ? body.direct : trackingNumberEntityOld.direct,
            lendParams: (body.lendParams != undefined && body.lendParams != null) ? body.lendParams : trackingNumberEntityOld.lendParams,
            lendPage: (body.lendPage != undefined && body.lendPage != null) ? body.lendPage : trackingNumberEntityOld.lendPage,
            webRef: (body.webRef != undefined && body.webRef != null) ? body.webRef : trackingNumberEntityOld.webRef,
            search: (body.search != undefined && body.search != null) ? body.search : trackingNumberEntityOld.search,
            poolSize: body.poolSize ? body.poolSize : trackingNumberEntityOld.poolSize,
            destinationNumber: body.destinationNumber ? body.destinationNumber : trackingNumberEntityOld.destinationNumber,
            poolName: body.poolName ? body.poolName : trackingNumberEntityOld.poolName,
            trackCampaign: (body.trackCampaign || body.trackEachVisitor) ? body.trackCampaign && trackingNumberEntityOld.trackCampaign !== body.trackCampaign ? !trackingNumberEntityOld.trackCampaign : trackingNumberEntityOld.trackCampaign : trackingNumberEntityOld.trackCampaign,
            trackEachVisitor: (body.trackCampaign || body.trackEachVisitor) ? body.trackEachVisitor && trackingNumberEntityOld.trackEachVisitor !== body.trackEachVisitor ? !trackingNumberEntityOld.trackEachVisitor : trackingNumberEntityOld.trackEachVisitor : trackingNumberEntityOld.trackEachVisitor,
            numberOnWebSite: (body.numberOnWebSite) ? body.numberOnWebSite : trackingNumberEntityOld.numberOnWebSite,
            numberOnline: (body.numberOnline) ? body.numberOnline : trackingNumberEntityOld.numberOnline,
            isTextMessaging: (body.isTextMessaging != undefined && body.isTextMessaging != null) ? body.isTextMessaging : trackingNumberEntityOld.isTextMessaging,
        };
    }

    async patch(currentUser, body) {
        try {
            if (!body.id) await HelperClass.throwErrorHelper('tracking_number:youShouldPassId');
            let trackingNumber: any = await this.getTrackingNumberById(body.id, currentUser.userId, currentUser.accountId);
            if (!trackingNumber) await HelperClass.throwErrorHelper('tracking_number:thisTrackingNumberDoesNotExist');
            let token = await this.opentactService.adminLoginGettignToken();
            let didEntitiesList = await this.opentactService.getDidList(token.token);
            let didEntity = (body.didID) ? {
                isDidPassed: true,
                isDidExist: await this.isDidExistInReturnedList(didEntitiesList, body.didID)
            } : {
                    isDidPassed: false,
                    isDidExist: false,
                    didIDField: trackingNumber.didID
                };
            if (didEntity.isDidPassed && !didEntity.isDidExist) await HelperClass.throwErrorHelper(`did:thisDidIsNotExist[${body.didID}]`);
            let booleanFields: any = (body.alwaysSwap || body.direct || body.lendParams || body.lendPage || body.webRef || body.search) ? {
                isSomeFieldPassed: true,
                isCountCorrect: await this.isMoreThenOneField(body)
            } : {

                    isSomeFieldPassed: false
                };
            if ((booleanFields.isSomeFieldPassed) && (booleanFields.isCountCorrect[0] === 'search') && (!body.visitorFrom && !body.visitorFor)) await HelperClass.throwErrorHelper(`tracking_number: youShouldPAssVisitorsFromAndvisitorForIfYouPassSearchParameter`);
            if ((booleanFields.isSomeFieldPassed) && (booleanFields.isCountCorrect[0] === 'webRef') && (!body.visitorFrom || body.visitorFor)) await HelperClass.throwErrorHelper(`tracking_number: youShouldPAssVisitorsFromFieldIfYouPassWebRefParamAndYouShouldNotPassVisitorFor`);
            if ((booleanFields.isSomeFieldPassed) && (booleanFields.isCountCorrect[0] === 'lendPage') && (!body.visitorFrom || body.visitorFor)) await HelperClass.throwErrorHelper(`tracking_number: youShouldPAssVisitorsFromFieldIfYouPassLendPageParamAndYouShouldNotPassVisitorFor`);
            if ((booleanFields.isSomeFieldPassed) && (booleanFields.isCountCorrect[0] === 'lendParams') && (!body.visitorFrom || body.visitorFor)) await HelperClass.throwErrorHelper(`tracking_number: youShouldPAssVisitorsFromFieldIfYouPassLendParamsParamAndYouShouldNotPassVisitorFor`);
            let whisperMessage = (body.whisperMessageBoolean || body.whisperMessage) ? {
                isWhisperMessageBooleanPassed: body.whisperMessageBoolean,
                isWhisperMessagePassed: body.whisperMessage,
                isCorrectFirst: (body.whisperMessageBoolean) ? (!body.whisperMessage)? await HelperClass.throwErrorHelper('tracking_number:yourShouldPassWhisperMessageTextFieldBooleanFieldSelected'): true: true
            } : {
                    isWhisperMessageBooleanPassed: false,
                    isWhisperMessagePassed: false
                };

            if (body.trackEachVisitor && body.trackCampaign) await HelperClass.throwErrorHelper(`did:ifYouWantToChangeOneFromThisFields[trackCampaign,trackEachVisitor]youShouldChooseOnlyOneFromThem`);
            let object = await this.getObjectForSavingTrackingNumberPatch(body, currentUser.userId, currentUser.accountId, trackingNumber, body.number, booleanFields.isCountCorrect);
            return await this.updateTrackingNumber(object)
        } catch (err) {
            throw err;
        }
    }

    async create(currentUser, accountNumber: AccountNumberReq) {
        let { didID } = accountNumber;
        let { userId, accountId } = currentUser;
        if (!didID) await HelperClass.throwErrorHelper('did:passDidID');
        let trackingNumber = await this.isDidNumberAlreadyAddedInTrackingTable(didID, currentUser.userId);
        if (trackingNumber) await HelperClass.throwErrorHelper(`tracking_number: thisNumber(${trackingNumber.number}),alreadyAdded`);
        if (!accountNumber.numberOnline) await HelperClass.throwErrorHelper('tracking_number:youShouldPassNumberOnlineField');
        if (!accountNumber.numberOnWebSite) await HelperClass.throwErrorHelper('tracking_number:youShouldPassNumberOnWebSiteField');
        if (!accountNumber.trackEachVisitor && !accountNumber.trackCampaign) await HelperClass.throwErrorHelper('tracking_number:youShouldPassOneFieldOrTrackEachVisitorOrTrackCampaign');
        if (accountNumber.trackEachVisitor && accountNumber.trackCampaign) await HelperClass.throwErrorHelper('tracking_number:youShouldPassOneFieldOrTrackEachVisitorOrTrackCampaign');
        if (!accountNumber.poolName) await HelperClass.throwErrorHelper('tracking_number:youShouldPassPoolNameField');
        if (!accountNumber.destinationNumber) await HelperClass.throwErrorHelper('tracking_number:youShouldPassDestinationNumberField');
        if (!accountNumber.poolSize) await HelperClass.throwErrorHelper('tracking_number:youShouldPassPoolSizeField');
        if (
            !accountNumber.search && !accountNumber.webRef && !accountNumber.lendPage && !accountNumber.lendParams
            && !accountNumber.direct && !accountNumber.alwaysSwap
        ) await HelperClass.throwErrorHelper('tracking_number:youShouldPassOneFromNextFields(alwaysSwap,direct,lendParams,lendPage,webRef,search)');
        await this.isMoreThenOneField(accountNumber);
        let search = (accountNumber.search) ? (!accountNumber.visitorFrom) ? await HelperClass.throwErrorHelper(`
    tracking_number: youShouldPAssVisitorsFromField
`) :
            (!accountNumber.visitorFor) ? await HelperClass.throwErrorHelper(`
    tracking_number: youShouldPAssVisitorForField
`)
                : { visitorFor: accountNumber.visitorFor, visitorsFrom: accountNumber.visitorFrom } : null;
        let webRef = (accountNumber.webRef) ? (!accountNumber.visitorFrom) ? await HelperClass.throwErrorHelper(`
    tracking_number: youShouldPAssVisitorsFromField
`) :
            (accountNumber.visitorFor) ? await HelperClass.throwErrorHelper(`
    tracking_number: ifYouPassWebRefYouShouldPassOnlyVisitorFrom
`) : true : null;
        let landingPage = (accountNumber.lendPage) ? (!accountNumber.visitorFrom) ? await HelperClass.throwErrorHelper(`
    tracking_number: youShouldPAssVisitorsFromField
`) :
            (accountNumber.visitorFor) ? await HelperClass.throwErrorHelper(`
    tracking_number: ifYouPassLendingPageYouShouldPassOnlyVisitorFrom
`) : true : null;
        let landingParams = (accountNumber.lendParams) ? (!accountNumber.visitorFrom) ? await HelperClass.throwErrorHelper(`
    tracking_number: youShouldPAssVisitorsFromField
`) :
            (accountNumber.visitorFor) ? await HelperClass.throwErrorHelper(`
    tracking_number: ifYouPassLendingParamsYouShouldPassOnlyVisitorFrom
`) : true : null;
        let whisperMessage = (accountNumber.whisperMessageBoolean) ? (!accountNumber.whisperMessage)
            ? await HelperClass.throwErrorHelper('tracking_number:yourShouldPassWhisperMessageTextFieldBooleanFieldSelected') : accountNumber.whisperMessage : null;
        let token = await this.opentactService.adminLoginGettignToken();
        let entity = await this.opentactService.buyDid(token.token, didID);
        // let callUrl = `${process.env.CURRENT_SERVER_EMAIL}/did/xml`;
        // let callStatusUrl = `${process.env.CURRENT_SERVER_EMAIL}/did/xml`;
        let identity = await this.opentactService.getIdentity(token.token, currentUser.userUuid);	        
        let response = await this.opentactService.assignDidToIdentity(token.token, undefined, /*callStatusUrl,*/ entity.id, identity.id);
        let didNumber = response.did.number;
        let did = await this.didFacade.addDidAfterBuy(userId, accountId, entity.did.id, true, didNumber, entity.id);
        let object = await this.getObjectForSavingTrackingNumber(accountNumber, currentUser.userId, currentUser.accountId, didNumber, did[0].did_id);
        return {
            trackingNumber: await this.addTrackingNumber(object),
            did
        };
    }

    async addDidNumbers(userID, accountID, didStatus, didNumbers) {
        try {
            for (let num of didNumbers) {
                let didNumber = num.tn;
                let did = await this.didFacade.addDidAfterBuying(userID, accountID, didStatus, didNumber);
                let accountNumber = {
                    recordCalls: '',
                    recordCallsBoolean: true,
                    alwaysSwap: true,
                    trackEachVisitor: true,
                };
    
                let object = await this.getObjectForSavingTrackingNumber(accountNumber, userID, accountID, didNumber, did.raw[0].did_id);
                return {
                    trackingNumber: (await this.addTrackingNumber(object))?.raw,
                    did: did.raw
                }
            }
        } catch (e) {
            return { error: e.message };
        }
    }

    getObjectForSavingTrackingNumber(accountNumber, userID, accountID, didNumber, did_id) {
        return {
            didID: did_id,
            userID,
            accountID,
            recordCalls: accountNumber.recordCalls,
            recordCallsBoolean: accountNumber.recordCallsBoolean,
            whisperMessage: (accountNumber.whisperMessage) ? accountNumber.whisperMessage : '',
            whisperMessageBoolean: (accountNumber.whisperMessageBoolean) ? accountNumber.whisperMessageBoolean : false,
            number: didNumber,
            visitorFor: (accountNumber.visitorFor) ? accountNumber.visitorFor : '',
            visitorFrom: (accountNumber.visitorFrom) ? accountNumber.visitorFrom : '',
            alwaysSwap: (accountNumber.alwaysSwap) ? accountNumber.alwaysSwap : false,
            direct: (accountNumber.direct) ? accountNumber.direct : false,
            lendParams: (accountNumber.lendParams) ? accountNumber.lendParams : false,
            lendPage: (accountNumber.lendPage) ? accountNumber.lendPage : false,
            webRef: (accountNumber.webRef) ? accountNumber.webRef : false,
            search: (accountNumber.search) ? accountNumber.search : false,
            poolSize: (accountNumber.poolSize) ? accountNumber.poolSize : 1,
            destinationNumber: (accountNumber.destinationNumber) ? accountNumber.destinationNumber : 1,
            poolName: (accountNumber.poolName) ? accountNumber.poolName : '',
            trackCampaign: (accountNumber.trackCampaign) ? accountNumber.trackCampaign : false,
            trackEachVisitor: (accountNumber.trackEachVisitor) ? accountNumber.trackEachVisitor : false,
            numberOnWebSite: (accountNumber.numberOnWebSite) ? accountNumber.numberOnWebSite : false,
            numberOnline: (accountNumber.numberOnline) ? accountNumber.numberOnline : false,
            isTextMessaging: (accountNumber.isTextMessaging) ? accountNumber.isTextMessaging : false,
        };
    }

    addTrackingNumber(object) {
        return this.entityManager.createQueryBuilder()
            .insert()
            .into(AccountNumber)
            .values({
                did: Did.withId(object.didID),
                userID: object.userID,
                accountID: object.accountID,
                recordCalls: object.recordCalls,
                recordCallsBoolean: object.recordCallsBoolean,
                whisperMessage: object.whisperMessage,
                whisperMessageBoolean: object.whisperMessageBoolean,
                number: object.number,
                visitorFor: object.visitorFor,
                visitorFrom: object.visitorFrom,
                alwaysSwap: object.alwaysSwap,
                direct: object.direct,
                lendParams: object.lendParams,
                lendPage: object.lendPage,
                webRef: object.webRef,
                search: object.search,
                poolSize: object.poolSize,
                destinationNumber: object.destinationNumber,
                poolName: object.poolName,
                trackCampaign: object.trackCampaign,
                trackEachVisitor: object.trackEachVisitor,
                numberOnWebSite: object.numberOnWebSite,
                numberOnline: object.numberOnline,
                status: true,
                isTextMessaging: object.isTextMessaging,
                registerDate: new Date(),
            })
            .returning('*')
            .execute();
    }

    updateTrackingNumber(object) {
        return this.entityManager.createQueryBuilder()
            .update(AccountNumber)
            .set({
                // didID: object.didID, ??????????
                userID: object.userID,
                accountID: object.accountID,
                recordCalls: object.recordCalls,
                recordCallsBoolean: object.recordCallsBoolean,
                whisperMessage: object.whisperMessage,
                whisperMessageBoolean: object.whisperMessageBoolean,
                number: object.number,
                visitorFor: object.visitorFor,
                visitorFrom: object.visitorFrom,
                alwaysSwap: object.alwaysSwap,
                direct: object.direct,
                lendParams: object.lendParams,
                lendPage: object.lendPage,
                webRef: object.webRef,
                search: object.search,
                poolSize: object.poolSize,
                destinationNumber: object.destinationNumber,
                poolName: object.poolName,
                trackCampaign: object.trackCampaign,
                trackEachVisitor: object.trackEachVisitor,
                numberOnWebSite: object.numberOnWebSite,
                numberOnline: object.numberOnline,
                status: true,
                isTextMessaging: object.isTextMessaging,
                // callFlow: object.callFlow
            })
            .where('id=:id', { id: object.id })
            .andWhere('userID=:userID', { userID: object.userID })
            .andWhere('accountID=:accountID', { accountID: object.accountID })
            .returning('*')
            .execute();
    }

    throwError(err) {
        throw new Error(`${err}`);
    }

    isDidNumberAlreadyAddedInTrackingTable(didID, userID) {
        if (typeof didID == 'number') {
            return this.entityManager.createQueryBuilder(AccountNumber, 'an')
                .where('an.did=:didID', { didID: didID })
                .andWhere('an.userID=:userID', { userID: userID })
                .getOne();
        }
        else if (typeof didID == 'string' && didID.indexOf("op2_" + Constants.VENDOR_FOR_INTELIQUENT) === 0) {
            const idInteliquent = didID.split("_");
            const number = idInteliquent[3];
            return this.entityManager.createQueryBuilder(AccountNumber, 'an')
                .where('an.number=:number', { number: number })
                .andWhere('an.userID=:userID', { userID: userID })
                .getOne();
        }
    }

    async findById(accountId: number, acnuId: number) {
        let manager = await this.entityManager;
        return manager.createQueryBuilder(AccountNumber, "acnu")
            .leftJoinAndSelect("acnu.account", "account")
            .where("account.id = :accountId ")
            .andWhere("acnu.id = :acnuId ")
            .leftJoinAndSelect("acnu.did", "did")
            .setParameters({ accountId, acnuId })
            .getOne();
    }

    // async blockedNumber(number) {
    //     let blocked = await this.entityManager.createQueryBuilder(AccountBlacklist, 'ab')
    //         .where('ab.number=:number', { number })
    //         .getOne();

    //     return blocked?.status;
    // }

    async ownNumber(userID, accountID, number) {
        return await this.entityManager.createQueryBuilder(AccountNumber, 'an')
            .leftJoinAndSelect("an.did", "did")
            .where('an.userID=:userID', { userID: userID })
            .andWhere('an.accountID=:accountID', { accountID: accountID })
            .andWhere('did.did_number=:number', {number: number})
            .getOne();
    }
}
