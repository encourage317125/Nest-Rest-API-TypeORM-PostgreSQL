import {ApiProperty} from '@nestjs/swagger';
import { OrderDid } from './order_did';


export class SignupReq {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    rePassword: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty({
        type: [OrderDid],
      })
    did_numbers?: OrderDid[];
}

export class GoogleCode {
  @ApiProperty()
  code: string
}

// export class CreateUserReq {
//   @ApiProperty()
//   email: string;
//   @ApiProperty()
//   password: string;
//   @ApiProperty()
//   rePassword: string;
//   @ApiProperty()
//   firstName: string;
//   @ApiProperty()
//   lastName: string;
// }