import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../../models';


@Injectable()
export class AccountsRepository extends BaseAbstractRepository<Account>  {

  constructor(@InjectRepository(Account)
              private readonly accountsRepository:Repository<Account>,
  ) {
    super(accountsRepository);
  }

}