import { Controller, HttpStatus, Req, Res, Post, Get, Body, Headers, Param } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiTags, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
// import { PaymentsService, CreatePayment } from "../payments";
import { PaymentOrder } from '../../util/swagger';
import { EmailService } from '../email';
import { OpentactService } from '../opentact';
import { AccountNumberFacade } from '../facade';



@Controller('payments')
@ApiBearerAuth()
@ApiTags("Payments")
export class PaymentsController {
    constructor(
        // private paymentsService: PaymentsService,
        private opentactService: OpentactService,
        private emailService: EmailService,
        private accountNumberFacade: AccountNumberFacade,
    ) { }

    // @Post('create_payments')
    // @ApiOperation({ description: "create payments for Paypal and Stripe", })
    // @ApiResponse({ status: 200, description: "id" })
    // public async createPayment(@Req() req, @Res() res: Response, @Body() body: CreatePayment) {
    //     try {

    //         const { register, ...rest } = body;

    //         let userID,
    //             accountID,
    //             didNumbers,
    //             userNumbers,
    //             numbers = register.did_numbers;

    //         if (numbers) {
    //             let userToken = await this.opentactService.getToken();
    //             didNumbers = await this.opentactService.buyDidNumbers(userToken.payload.token, numbers);

    //             if (didNumbers.error) {
    //                 return res.status(didNumbers.error.status).json(didNumbers);
    //             }
                
    //             if (didNumbers.payload.failed || didNumbers.payload.state === 'failed') {
    //                 return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Buying number is failed.' })
    //             }
    //         }

    //         let response = await this.paymentsService.createPayment({ ...rest, accountID });
    //         if (response.error) {
    //             return res.status(HttpStatus.BAD_REQUEST).send({ message: (response.error === '404') ? `Payment responde with status ${response.error}`: response.error });
    //         }
            
    //         const result = await this.paymentsService.createUser(register);
    //         if (result.user.error) {
    //             return res.status(HttpStatus.BAD_REQUEST).json(result);
    //         }
    //         if (result.user['user']) {
    //             userID = result.user['user'].id;

    //             this.emailService.sendMail("auth:signup", result.user['user'].email, {
    //                 FIRST_NAME: result.user['user'].firstName,
    //                 LAST_NAME: result.user['user'].lastName,
    //                 BUTTON: `${process.env.BASE_URL||process.env.FREESMS_URL}/auth/activate?uuid=${result.user['user'].uuid}`,
    //                 LINK: `${process.env.BASE_URL||process.env.FREESMS_URL}/auth/activate?uuid=${result.user['user'].uuid}`,
    //                 LOGO: `${process.env.BASE_URL||process.env.FREESMS_URL}/public/assets/logo.png`
    //             });
    //         }
    //         if (result.user['account']) {
    //             accountID = result.user['account'].id;
    //         }
    //         // if (result.user['company']) {
    //         //     company = result.user['company'];
    //         // }

    //         await this.paymentsService.storePaymentData(response.paymentID, { ...rest, userID, accountID, numbers });

    //         if (numbers) {
    //             userNumbers = await this.accountNumberFacade.addDidNumbers(userID, accountID, true, didNumbers.payload.request.items );
    //             if (userNumbers.error) {
    //                 return res.status(HttpStatus.BAD_REQUEST).json(userNumbers.error);
    //             }
    //         }
    //         return res.status(HttpStatus.OK).json({ ...response, ...{numbers: userNumbers}, ...{userID, accountID} });
    //     } catch (err) {
    //         throw new Error(err.message)
    //     }
    // }

    // @Get('payment_approval_url/:service/:orderId')
    // @ApiOperation({ description: "get payment approval url" })
    // @ApiResponse({ status: 200, description: "returns the payment ,approval url" })
    // @ApiParam({ name: "orderId", description: "payment order id" })
    // @ApiParam({ name: "service", description: "payment service name. expects 'paypal' or 'stripe'" })
    // public async getPaymentApprovalUrl(@Req() req, @Res() res: Response, 
    //     @Param('orderId') orderId: string,
    //     @Param('service') service: string
    // ) {
    //     let url = await this.paymentsService.approvalUrl(service, orderId);
    //     return res.status(HttpStatus.OK).json(url);
    // }

    // @Post('execute_paypal_payments')
    // @ApiOperation({ description: "execute payments for Paypal", })
    // @ApiResponse({ status: 200, description: "returns succes: true/false" })
    // @ApiBody({
    //     required: true,
    //     type:PaymentOrder
    //     // name: "paymeny/ orderID"
    // })
    // public async executePaypalPayment(@Req() req, @Res() res: Response, @Body() body: PaymentOrder) {
    //     let response = await this.paymentsService.executePayment({ body, type: 'paypal' });
    //     return res.status(HttpStatus.OK).json(response);
    // }

    // @Post('execute_stripe_payments')
    // @ApiOperation({ description: "execute payments for Stripe", })
    // @ApiResponse({ status: 200, description: "returns succes: true/false" })
    // public async executeStripePayment(@Headers('stripe-signature') signature, @Req() req, @Res() res: Response) {
    //     let response = await this.paymentsService.executePayment({ sig: signature, body: req.rawBody, type: 'stripe' });
    //     return res.status(HttpStatus.OK).json(response);
    // }
}


