import { Injectable, Inject } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
var nodeBase64 = require('nodejs-base64-converter');
import * as https from 'https';
import fetch from 'node-fetch';
import { Config } from '../../util/config'
import constants from "../../constants"
import { opentactISMSNewParams, opentactISIPControlAppCallSearchParams, opentactITNLeaseSearchParams, opentactIOutboundVoiceProfileUpdateParams, opentactITNOrderNewParams, opentactIOutboundVoiceProfileNewParams, opentactISIPDomainUpdateParams, opentactISIPControlAppNewParams, opentactISIPControlAppUpdateParams, opentactISMSISearchParams, opentactISMSISMSSearchParams } from './opentact.dto';
import { BaseService } from '../services/base.service';
import { WSGateway } from '../websocket/sms.gateway';
import * as FormData from 'form-data';
import { createReadStream, existsSync, mkdirSync, promises as fsPromises, unlinkSync, writeFileSync } from 'fs';
import { components } from './opentact-original.dto'
import { Repositories } from '../db/repositories';

@Injectable()
export class OpentactService extends BaseService {
    private axios: AxiosInstance
    private jwtToken: string

    constructor(
        @Inject('Repositories')
        private readonly Repositories: Repositories,
        @Inject('DidsRepository')
        private readonly wsGateway: WSGateway) {
        super()
        this.axios = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            baseURL: `${process.env.OPENTACT_API}`,
            headers: {
                common: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        });
        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();

    }

    private _initializeResponseInterceptor = () => {
        this.axios.interceptors.response.use(
            this._handleResponse,
            this._handleError,
        );
    };

    private _initializeRequestInterceptor = () => {
        this.axios.interceptors.request.use(
            this._handleRequest,
            this._handleError,
        );
    };

    private _handleResponse = (response: AxiosResponse) => {
        return response
    };

    private _handleError = (error: any) => {
        if (error.response?.status === 401 && error.response.statusText === 'Unauthorized') {
            return this.getToken().then((data) => {
                error.config.headers['X-Auth-Token'] = data.payload.token
                return axios.request(error.config);
            });
        }
        console.error(error.response.data)
        return Promise.reject(error)
    };

    private _handleRequest = (config: AxiosRequestConfig) => {
        if (this.jwtToken) {
            config.headers['X-Auth-Token'] = this.jwtToken;
        }

        return config;
    };

    async getTrackingNumbers({ skip = 0, take = 10, type = 'long_code', pattern = undefined, line = undefined, profile = 'US',  city = undefined, state = undefined, npa = undefined, features = ['sms', 'voice'] } = {}) {
        try {
            const country = profile
            const response = await this.axios.post(`/tn/search`, {
                country,
                state,
                city,
                type,
                line,
                pattern,
                npa,
                take,
                features
            })
            return response.data;
        }
        catch (e) {
            console.log('TrackingNumber', e)
            throw e
        }
    }

    async getAvailableRatecenterNpaNxx(state) {
        const response = await this.axios.get(`/dict/lerg/ratecenters?state=${state}`)
        return response.data;
    }

    async getCountryCodes() {
        const response = await this.axios.get(`/dict/country`)
        return response.data;
    }

    async getMessagingProfile() {
        const response = await this.axios.get(`/profile/messaging`)
        return response.data;
    }

    async getSipApp() {
        const response = await this.axios.get(`/sip/app`)
        return response.data;
    }

    async getSipAppCalls(data: opentactISIPControlAppCallSearchParams) {
        const response = await this.axios.post(`/sip/app/call/search`, data)
        return response.data;
    }

    async getSipDomains() {
        const response = await this.axios.get(`/sip/domain`)
        return response.data;
    }

    async updateSipDomain(domain: string, data: opentactISIPDomainUpdateParams) {
        const response = await this.axios.patch(`/sip/domain/${domain}`, data)
        return response.data;
    }

    async createSipApp(data: opentactISIPControlAppNewParams) {
        const response = await this.axios.post(`/sip/app`, data)
        return response.data;
    }

    async updateSipApp(uuid: string, data: opentactISIPControlAppUpdateParams) {
        const response = await this.axios.patch(`/sip/app/${uuid}`, data)
        return response.data;
    }

    async getOutboundVoiceProfile() {
        const response = await this.axios.get(`/profile/outbound_voice`)
        return response.data;
    }

    async createOutboundVoiceProfile(data: opentactIOutboundVoiceProfileNewParams) {
        const response = await this.axios.post(`/profile/outbound_voice`, data)
        return response.data;
    }

    async updateOutboundVoiceProfile(data: opentactIOutboundVoiceProfileUpdateParams, uuid: string) {
        const response = await this.axios.patch(`/profile/outbound_voice/${uuid}`, data)
        return response.data;
    }

    async getSipAppLeases(uuid: string) {
        const response = await this.axios.get(`/sip/app/${uuid}/tnlease`)
        return response.data;
    }

    async addSipAppLeases(data, uuid: string) {
        const response = await this.axios.post(`/sip/app/${uuid}/tnlease`, data)
        return response.data;
    }

    async updateMessagingProfile(data, uuid) {
        const response = await this.axios.patch(`/profile/messaging/${uuid}`, data)
        return response.data;
    }

    async createSMS(data: opentactISMSNewParams) {
        const response = await this.axios.post(`/sms`, data)
        return response.data;
    }

    // async callFlowCallback(from?, to?, data?) {
    //     if (to) {
    //         const didEntity = await this.Repositories.DID.findOne({
    //             where: { number: to, status: true },
    //         });
    //         if (didEntity) {
    //             if (from) {
    //                 const blackList = await this.Repositories.BLACKLISTS.findOne({
    //                     where: { accountId: didEntity.accountID, number: from, status: true },
    //                 });
    //                 if (blackList) {
    //                     const blacklistXml = await fsPromises.readFile('blacklist.xml')
    //                     return blacklistXml
    //                 }
    //             }
    //             let cfEntity
    //             if (didEntity.cfId) {
    //                 cfEntity = await this.Repositories.CALL_FLOW.findOne({
    //                     where: { accountId: didEntity.accountID, id: didEntity.cfId },
    //                 });
    //                 console.log('cfEntity', cfEntity)

    //            } else {
    //                 cfEntity = await this.Repositories.CALL_FLOW.findOne({
    //                     where: { account: didEntity.accountID },
    //                 });
    //             }
    //             if (cfEntity) { return cfEntity.xml }
    //         }
    //     }
    //     const defaultXml = await fsPromises.readFile('default.xml')
    //     return defaultXml

    // }

    async smsSentCallback(body) {
        console.log('sms sentcallback')
        return { success: true }
    }

    async smsGetCallback(body, req) {
        if (!(Object.keys(body).length > 0 && body.constructor === Object)) {
            console.log('empty sms callback')
            return { success: false, message: 'empty sms callback', body }
        } else if (body.state === 'success') {
            console.log('get new sms')
            const didEntity = await this.getEntity(this.Repositories.DID, { number: body.to })
            if (didEntity) {
                const response = await this.wsGateway.sendMessage(didEntity.accountID, body)
            }
        } else {
            console.log('get new sms, state not success')
        }

        return { success: true }
    }

    async searchSMS(data: opentactISMSISMSSearchParams): Promise<components["schemas"]["ISMSISMSSearchResponse"]> {
        const userToken = await this.getToken();
        const response = await this.axios.post(`/sms/search`, data,{
            headers: {
                "X-Auth-Token": userToken.payload.token,
                "Content-Type": "multipart/form-data"
              }
        })
        return response.data;
    }

    async searchInboundSMS(data: opentactISMSISearchParams) {
        const response = await this.axios.post(`/sms/search/inbound`, data)
        return response.data;
    }

    async createSipUser(data) {
        const response = await this.axios.post(`/sip/domain/${constants.OPENTACT_SIP_DOMAIN}/user`, data)
        return response.data;
    }

    async getSipUsers() {
        const response = await this.axios.get(`/sip/domain/${constants.OPENTACT_SIP_DOMAIN}/user`)
        return response.data;
    }

    async getSipUser(uuid) {
        const response = await this.axios.get(`/sip/domain/${constants.OPENTACT_SIP_DOMAIN}/user/${uuid}`)
        return response.data;
    }

    async updateSipUser({ uuid, data }) {
        const response = await this.axios.patch(`/sip/domain/${constants.OPENTACT_SIP_DOMAIN}/user/${uuid}`, data)
        return response.data;
    }

    async deleteSipUser(uuid) {
        const response = await this.axios.delete(`/sip/domain/${constants.OPENTACT_SIP_DOMAIN}/user/${uuid}`)
        return response.data;
    }

    async getOrders() {
        const response = await this.axios.get(`/order`)
        return response.data;
    }

    async getSipConnections() {
        const response = await this.axios.get(`/sip/connection`)
        return response.data;
    }



    async getOrder(uuid) {
        const response = await this.axios.get(`/order/${uuid}`)
        return response.data;
    }

    async getOrderPrice(data) {
        const response = await this.axios.post(`order/price`, data)
        return response.data;
    }


    async createTNOrder(data: opentactITNOrderNewParams): Promise<components["schemas"]["ITNOrderResponse"]> {
        const response = await this.axios.post(`/order/tn`, data)
        return response.data;
    }

    async getLeases(data: opentactITNLeaseSearchParams) {
        const response = await this.axios.post(`/lease/tn/search`, data)
        return response.data;
    }

    async getLease(uuid) {
        const response = await this.axios.get(`/lease/tn/${uuid}`)
        return response.data;
    }

    async updateLease({ uuid, data }) {
        const response = await this.axios.patch(`/lease/tn/${uuid}`, data)
        return response.data;
    }

    async deleteLease(uuid) {
        const response = await this.axios.delete(`/lease/tn/${uuid}`)
        return response.data;
    }

    async nonce() {
        this.axios.get(`/auth/nonce/${process.env.FREESMS_APP}`)
            .then(response => console.log(response))
            .catch(error => console.log(error.message))
        return { nonce: 'test' }
    }

    async sessionToken(nonce: string, userId?, identityToken?) {
        return (await this.axios.post("/auth/sessionToken/" + nonce, { userId, identityToken })).data;
    }

    async getSessionTokenByUuidAndNonce(nonce: string, userId) {
        return this.axios.post("/auth/sessionToken/" + nonce, { userId: userId })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                throw err;
            });
    }

    async createIdentity(token: string, user) {
        return await this.axios.post(`/identities/app/${process.env.FREESMS_APP}`, user, { headers: { "Authorization": "Bearer " + token } })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err);
                throw new Error(`Opentact error - ${err.response.data.message}`);
            });
    }

    async removeTNLeases(item) {
        const authorization = nodeBase64.encode((process.env.OPENTACT_ADMIN_EMAIL + ':' + process.env.OPENTACT_ADMIN_PASSWORD))
        return await this.axios.delete('lease/tn',
            { 
                headers: {"Authorization": `Basic ${authorization}`},
                data: { item }
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err);
                throw new Error(`Opentact error - ${err.response.data.message}`);
            });
    }

    async buyDidNumbers(token, items) {
        return await this.axios.post(`${process.env.OPENTACT_API}/order`, { "items": items }, 
            { 
                headers: { "X-Auth-Token": token, "Content-Type": "application/json" } 
            })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err)
                return { error: err.response.data };
            });
    }

    async buyDid(token: string, didId: string) {
        return await fetch(`${process.env.OPENTACT_API}/dids/buyDid/${process.env.FREESMS_APP}/${didId}`, {
            method: 'POST',
            headers: { "Authorization": "Bearer " + token },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    throw new Error(`${res.message}`);
                }
                return res;
            }).catch((err) => {
                console.log(err, 'err');
                throw err;
            });
    }

    async getDidList(token: string) {
        return await fetch(`${process.env.OPENTACT_API}/dids/searchDids?areaCodeId=319&countryId=226`, {
            method: 'GET',
            headers: { "Authorization": "Bearer " + token },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    throw new Error(`${res.message}`);
                }
                return res;
            }).catch((err) => {
                throw err;
            });
    }

    async assignDidToIdentity(token, callUrl: any, /*callStatusUrl: string,*/ appDidID: number, identityID: any) {
        let body = {
            callUrl: callUrl || '',
            callStatusUrl: `${process.env.CURRENT_SERVER}/opentact/call_status_callback/`,
            identity: {} || undefined
        };

        if (identityID)
            body.identity = { id: identityID };
        if (body.callUrl == '')
            delete body.callUrl;
        if (body.identity == {})
            delete body.identity;

        return await this.axios.patch(`${process.env.OPENTACT_API}/dids/didApp/${appDidID}`, body, { headers: { "Authorization": "Bearer " + token } })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err);
                throw new Error(`Opentact error - ${err.response.data.message}`);
            });
    }

    async callLogsGetAll(token, take = 10, skip = 0, filterParams) {
        return (await this.axios.post(`/call/search`, filterParams, {
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            params: {
                skip: skip,
                take: take
            }
        })).data;
    }

    async callLogsInbound(token: string, startDate, endDate, offset, limit) {
        return (await this.axios.post(`/call/search?take=${limit}&skip=${offset}`, 
        {
            "direction": "in",
            "created_on_from": startDate,
            "created_on_to": endDate
        },
        {
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
        })).data;
    }

    async callLogsOutbound(token: string, startDate, endDate, offset, limit) {
        return (await this.axios.post(`/call/search?take=${limit}&skip=${offset}`, 
        {
            "direction": "out",
            "created_on_from": startDate,
            "created_on_to": endDate
        },
        {
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
        })).data;
    }

    async callLogsInboundByDid(currentUser, token: string, startDate, endDate, offset, limit, didNumber) {
        return (await this.axios.get(`/calls/log/inbound/did/${didNumber}`, {
            headers: { "Authorization": "Bearer " + token },
            params: {
                startDate: startDate,
                endDate: endDate,
                offset: offset,
                limit: limit
            }
        })).data;
    }

    async callLogsOutboundByDid(currentUser, token: string, startDate, endDate, offset, limit, didNumber) {
        return (await this.axios.get(`/calls/log/outbound/did/${didNumber}`, {
            headers: { "Authorization": "Bearer " + token },
            params: {
                startDate: startDate,
                endDate: endDate,
                offset: offset,
                limit: limit
            }
        })).data;
    }

    async callLogsInByDid(token: string, startDate, endDate, offset, limit, didNumber) {
        return (await this.axios.post(`/call/search`,
        {
            created_on_to: endDate,
            created_on_from: startDate,
            direction: "in",
            tn: `${didNumber}`
        }, 
        {
            headers: {
                "X-Auth-Token": token,
                "Content-Type": "application/json"
            },
            params: {
                skip: offset,
                take: limit
            }
        })).data;
    }

    async freeDids(token: string, areaCodeID, offset = 0, limit = 20) {
        return (await this.axios.get("/dids/searchDids", {
            headers: {
                "Authorization": "Bearer " + token
            },
            params: {
                areaCodeId: areaCodeID,
                countryId: 226,
                offset: offset,
                limit: limit
            }
        })).data;
    }

    async validAreaCodes(token: string, limit, offset) {
        return (await this.axios.get("/area_codes/valid", {
            headers: { "Authorization": "Bearer " + token },
            params: { limit: limit, offset, countryId: 226 }
        })).data;
    }

    async areaCodes(token: string, limit, offset) {
        return (await this.axios.get("/area_codes/valid/226", {
            headers: { "Authorization": "Bearer " + token },
            params: { limit: limit, offset }
        })).data;
    }

    async areaCodesAll(token: string) {
        return (await this.axios.get("/area_codes/valid/226", {
            headers: { "Authorization": "Bearer " + token }
        })).data;
    }

    async playTTS(token: string, text: string) {
        const uuid = Config.string("OPENTACT_ADMIN_PLAY_APP_UUID", "");
        return (await this.axios.post(`/tts/byApp/${uuid}/play`, { text }, { headers: { "Authorization": "Bearer " + token } })).data;
    }

    async getIdentity(token: string, userId: string) {
        return (await this.axios.get(`/identities/byUserIdApp/${userId}/${process.env.FREESMS_APP}`, {
            headers: { "Authorization": "Bearer " + token }
        })).data;
    }

    async getActiveCalls(token: string) {
        return (await this.axios.get(`/app_hooks/app/${process.env.FREESMS_APP}`, {
            headers: { "Authorization": "Bearer " + token }
        })).data;
    }

    async disableDid(token: string, didId: number) {
        console.log("url: ", `${process.env.OPENTACT_API}/dids/${didId}`);
        return await this.axios.delete(`${process.env.OPENTACT_API}/dids/${didId}`, { headers: { "Authorization": "Bearer " + token } })
            .then((res) => {
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw new Error(`Opentact error - ${err.response.data.message}`);
            });
    }

    async releaseAppDid(token: string, apdiId: number) {
        return await fetch(`${process.env.OPENTACT_API}/dids/releaseAppDid/${process.env.FREESMS_APP}/${apdiId}`, {
            method: 'POST',
            headers: { "Authorization": "Bearer " + token },
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    throw new Error(`${res.message}`);
                }
                return res;
            }).catch((err) => {
                console.log(err, 'err');
                throw err;
            });
    }

    async getIncomingCalls(token: string, startDate, endDate) {
        return (await this.axios.get(`/calls/report/inbound/app/${process.env.FREESMS_APP}`, {
            headers: { "Authorization": "Bearer " + token },
            params: {
                startDate: startDate,
                endDate: endDate,
            }
        })).data;
    }

    async getOutcomingCalls(token: string, startDate, endDate) {
        return (await this.axios.get(`/calls/report/outbound/app/${process.env.FREESMS_APP}`, {
            headers: { "Authorization": "Bearer " + token },
            params: {
                startDate: startDate,
                endDate: endDate,
            }
        })).data;
    }

    async sendSms(token: string, from: number, to: number, message: string) {
        return (await this.axios.post(`${process.env.OPENTACT_API}/sms`, 
            { 
                from: `${from}`, 
                to: to, 
                message: message
            }, 
            {
                headers: {
                    "X-Auth-Token": token,
                    "Content-Type": "application/json"
                }
        })).data;
    }

    async executeCallSCA(call_uuid) {
        const userToken = await this.getToken();
        const formData = new FormData();
        formData.append('file', createReadStream(constants.PATH_TO_TEMP_XML + '/call_flow_default.xml'));

        const response = await this.axios.post(`/call/sca/${call_uuid}`, formData, {
            headers: {
              "X-Auth-Token": userToken.payload.token,
              ...formData.getHeaders()
            },
        });

        return response.data;
    }

    async adminLoginGettignToken() {
        const authorization = nodeBase64.encode((process.env.OPENTACT_ADMIN_EMAIL + ':' + process.env.OPENTACT_ADMIN_PASSWORD))
        return await this.axios.get("/auth", {
            headers: {"Authorization": `Basic ${authorization}`},
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err, 'err');
                throw err;
            });
    }

    async getToken() {
        const authHeader = Buffer.from(`${constants.OPENTACT_USER}:${constants.OPENTACT_PASSWORD}`).toString('base64')
        const config = {
            headers: {
                Authorization: `Basic ${authHeader}`,
            }
        }
        const response = await this.axios.get("/auth", config)
        if (response.data.payload.token) {
            this.jwtToken = response.data.payload.token
        }
        return response.data;
    }
}


