import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../models';


@Injectable()
export class UsersRepository extends BaseAbstractRepository<User>  {

  constructor(@InjectRepository(User)
              private readonly usersRepository:Repository<User>,
  ) {
    super(usersRepository);
  }

}