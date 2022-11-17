// import { Module, Injectable, Inject } from '@nestjs/common';
// // import { PaymentsSettingsRepository } from "../database/repositories/paymentsSettings-repository";
// // import { BaseService } from "./base-service"
// // import { Repositories } from "./root-service";
// // import BigNumber from "bignumber.js";
// import constants from "../../constants";
// import * as request from "request";
// import axios from "axios";
// import Stripe from "stripe";
// import { CreatePayment } from './payments.dto';
// import { PaymentsRepository } from '../db/repositories/payments.repository'
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Payment } from '../../models';
// import { UsersRepository } from '../db/repositories/users.repository';
// import { AccountsRepository } from '../db/repositories/accounts.repository';
// import { DidsRepository } from '../db/repositories/did.repository';
// import { OpentactService } from '../opentact';
// import { BaseService } from '../services/base.service'
// import { TokensRepository } from '../db/repositories/tokens.repository';
// import { HelperClass } from "../../filters/Helper";
// import { AuthService } from '../auth';
// import { Transactional } from "typeorm-transactional-cls-hooked"
// import * as dayjs from "dayjs";
// import { PlansRepository } from '../db/repositories/plan.repository';
// import { AccountFacade } from '../facade';
// import { Repositories } from '../db/repositories';
// import { PasswordHelper } from '../../util/helper';
// import { response } from 'express';

// @Injectable()
// export class PaymentsService extends BaseService {
//     stripe: Stripe;
//     constructor(
//         @Inject('Repositories')
//         private readonly Repositories: Repositories,
//         @Inject('PaymentsRepository')
//         private readonly paymentsRepository: PaymentsRepository,
//         private readonly tokensRepository: TokensRepository,
//         private readonly usersRepository: UsersRepository,
//         private readonly accountsRepository: AccountsRepository,
//         private readonly didRepository: DidsRepository,
//         private readonly accountFacade: AccountFacade,
//         private readonly plansRepository: PlansRepository,
//         private readonly opentactService: OpentactService,
//         private authService: AuthService,

//     ) {
//         super()
//         this.stripe = new Stripe(constants.STRIPE_SECRET, { apiVersion: '2020-08-27', typescript: true, });
//     }

//     private async createPaypalPayment({ total_amount, items }) {
//         const response = await axios.post(
//             constants.PAYPAL_API + "/v2/checkout/orders",
//             {
//                 intent: "CAPTURE",
//                 purchase_units: [{
//                     amount: {
//                         value: total_amount,
//                         currency_code: "USD",
//                     },
//                 }],
//                 order_application_context: {
//                     return_url: constants.PAYMENT_SUCCESS_URL,
//                     cancel_url: constants.PAYMENT_CANCEL_URL,
//                 },
//             },
//             {
//                 auth: {
//                     username: constants.PAYPAL_CLIENT,
//                     password: constants.PAYPAL_SECRET
//                 }
//             },
//         )
//         return response.data.id
//     }

//     private async createStripePayment({ items }) {
//         const session = await this.stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: items,
//             mode: "payment",
//             success_url: constants.PAYMENT_SUCCESS_URL,
//             cancel_url: constants.PAYMENT_CANCEL_URL,
//         });
//         return session.id
//     }

//     private async paymentSucceed({ transactionId }) {
//         const updatedPayment = await this.updateEntity(this.Repositories.PAYMENTS, { transactionId }, { success: true })
//         const updatedUser = await this.updateEntity(this.Repositories.USERS, { id: updatedPayment.userId }, { status: true })
//         const updatedAccount = await this.updateEntity(this.Repositories.ACCOUNTS, { id: updatedUser.accountID }, { status: true })
//         const duration = await this.getDurationFromAmount(updatedPayment.amount, updatedUser.accountID,)
//         const didArray = await this.createDidNumbers({
//             numbers: updatedPayment.numbers,
//             accountID: updatedUser.accountID,
//             userID: updatedPayment.userId,
//             duration
//         })
//         // const updatedDid = await this.updateEntity(Repositories.DID, { accountID: updatedUser.accountID }, { status: true })
//         // const opentactOrder = await this.opentactService.createTNOrder({ tns: [updatedDid.number] })

//         return updatedAccount
//     }

//     @Transactional()
//     public async createUser(register) {
//         try {

//             const user = await this.authService.signUp(register);
//             if (user.error) {
//                 return { user: { error: user.error }}
//             }
//             if (!user) await HelperClass.throwErrorHelper('auth:BadRequest');
//             // const login = register.email.split('@')[0];
//             //TODO check unique login fro sipUser
//             const login = `${register.firstName}_${register.lastName}_${Date.now()}`;
//             const sipUser = await this.opentactService.createSipUser({
//                 login,
//                 password: register.password,
//             })
//             if (user.user) {
//                 const updatedAccount = await this.updateEntity(this.Repositories.USERS, { id: user.user.id }, { sipUsername: login })
//             }
//             if (user.account && user.user) {
//                 const createdTokens = await this.accountFacade.saveToken(login, register.password, user.user)
//             }
//             return { user }
//         } catch (e) {
//             return { user: { error: e.message }}
//         }
//     }

//     private async getDurationFromAmount(amount, accountId, planID?) {
//         let planId = planID;
//         if (accountId) {
//             const account = await this.getEntity(this.Repositories.ACCOUNTS, { id: accountId });
//             planId = account.planID;
//         }
//         if (!planId) {
//             throw new Error("Missing plan id")
//         }
//         const plan = await this.getEntity(this.Repositories.PLAN, { id: planId, status: true });
//         // const plan = await this.getEntity(Repositories.PLAN, [{ monthlyAmount: amount }, { annuallyAmount: amount }])
//         if (!plan) {
//             throw new Error("No such plan or user has another plan")
//         }
//         let duration
//         switch (+amount) {
//             case plan.annuallyAmount: duration = 12
//                 break
//             case plan.monthlyAmount: duration = 1
//                 break
//             default: throw new Error("Incorrect amount")
//         }

//         return duration
//     }


//     private async createDidNumbers({ numbers, accountID, userID, duration }) {
//         if (numbers.length > 2) {
//             throw new Error("Too many numbers")
//         }
//         const items = numbers.map(number => {
//             return { tn: number }
//         })
//         const opentactOrder = await this.opentactService.createTNOrder({ items })

//         const checkOpentactOrder = await this.opentactService.getOrder(opentactOrder.payload.uuid)
//         const expireOn = dayjs().endOf("date").add(duration, "month").toDate();
//         // TODO Add any alerts if order is not success
//         let promiseArray: Promise<any>[] = [];
//         numbers.forEach(number => {
//             const didPromise = this.didRepository.create({
//                 number: number,
//                 // accountID: data.user.account.id,
//                 // userID: data.user.user.id,
//                 status: true,
//                 accountID,
//                 userID,
//                 expireOn,
//             })
//             promiseArray.push(didPromise)
//         })
//         const result = await Promise.all(promiseArray);
//         return result;
//     }


//     public async createPayment(data) {
//         try {
//             let paymentId;
//             await this.getDurationFromAmount(data.amount, data.accountID, data.planID);
//             if (data.type === 'paypal') {
//                 const { items, total_amount } = await this.prepareDataPaypal(data.amount)
//                 paymentId = await this.createPaypalPayment({ total_amount, items })
//             } else
//                 if (data.type === 'stripe') {
//                     const { items, total_amount } = await this.prepareDataStripe(data.amount)
//                     paymentId = await this.createStripePayment({ items })
//                 }

//             return { paymentID: paymentId }


//         } catch (e) {
//             console.error(e)
//             return { error: e.message, status: e.status }
//         };
//     }

//     public async storePaymentData(paymentId, data) {
//         const paymentBody = {
//             transactionId: paymentId,
//             payWith: data.type,
//             userId: data.userID,
//             accountId: data.accountID,
//             amount: data.amount,
//             numbers: data.numbers,
//         }
//         return await this.paymentsRepository.create(paymentBody);
//     }

//     private async prepareDataPaypal(amount) {
//         // const items = [
//         //     {
//         //         name: 'top up',
//         //         currency: "USD",
//         //         description: 'top up your balance',
//         //         quantity: 1,
//         //         price: amount,
//         //     }
//         // ]
//         const items = [
//             {
//                 name: 'top up',
//                 currency: "USD",
//                 description: 'top up your balance',
//                 quantity: 1,
//                 unit_amount: amount,
//             }
//         ]
//         const total_amount = amount

//         return { total_amount, items }
//     }

//     private async prepareDataStripe(amount) {

//         const items = [{
//             price_data: {
//                 currency: "usd",
//                 product_data: {
//                     name: 'top up your balance',
//                     // images: [
//                     //   "https://ejphaq.stripocdn.email/content/guids/CABINET_fd920fd33be400d498bd92fecc8203fc/images/39921582644799675.PNG",
//                     // ],
//                 },
//                 unit_amount: amount * 100,
//             },
//             quantity: 1,
//             description: 'top up your balance'
//         }];

//         const total_amount = amount

//         return { total_amount, items }
//     }

//     private async executePaypalPayment({ body, sig }) {
//         try {

//             const orderID = body.orderId;

//             const response = await axios.post(
//                 constants.PAYPAL_API + `/v2/checkout/orders/${orderID}/capture`,
//                 {
//                 },
//                 {
//                     auth: {
//                         username: constants.PAYPAL_CLIENT,
//                         password: constants.PAYPAL_SECRET
//                     }
//                 })

//             if (response.data.body?.name === "VALIDATION_ERROR") {
//                 console.error(response.data.body.details);
//                 return { success: false }
//             } else if (response.data.status === 'COMPLETED') {
//                 return { success: true }
//             } else {
//                 return { success: false }
//             }

//         } catch (e) {
//             console.error(e)
//             throw e
//         };
//     }


//     private async executeStripePayment({ body, sig }) {
//         let event;
//         try {
//             event = this.stripe.webhooks.constructEvent(body, sig, constants.STRIPE_WEBHOOK_SECRET);

//             if (event.type === "checkout.session.completed") {
//                 return { success: true, id: event.data.object.id }
//             } else {
//                 return { success: false }
//             }
//         } catch (e) {
//             console.error(e)
//             throw e
//         };
//     }

//     public async executePayment({ body, sig = undefined, type }) {
//         let payment
//         let transactionId
//         if (type === 'paypal') {
//             payment = await this.executePaypalPayment({ body, sig, })
//             transactionId = body.orderID
//         }
//         else if (type === 'stripe') {
//             const { success, id } = await this.executeStripePayment({ body, sig, })
//             payment = { success }
//             transactionId = id
//         }
//         if (transactionId) {
//             const result = await this.paymentSucceed({ transactionId })
//         }
//         return payment
//     }

//     public async approvalUrl(service, orderID) {
//         if (service === 'paypal') {
//             const response = await axios.get(
//                 constants.PAYPAL_API + `/v2/checkout/orders/${orderID}`,
//                 {
//                     auth: {
//                         username: constants.PAYPAL_CLIENT,
//                         password: constants.PAYPAL_SECRET
//                     }
//                 });
    
//             return response.data.links.find(link => link.rel === 'approve');
//         } else if (service === 'stripe') {
//             const session = await this.stripe.checkout.sessions.retrieve(
//                 orderID, 
//                 {
//                     apiKey: constants.STRIPE_SECRET,
//                 });

//             return session['url'];
//         }
//     }

// }
