import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../../models';
import { User } from '../../../models';


@Injectable()
export class PaymentsRepository extends BaseAbstractRepository<Payment>  {

  constructor(@InjectRepository(Payment)
              private readonly paymentsRepository:Repository<Payment>,
  ) {
    super(paymentsRepository);
  }

}