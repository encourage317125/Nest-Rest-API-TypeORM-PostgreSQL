import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../../models';


@Injectable()
export class TokensRepository extends BaseAbstractRepository<Token>  {

  constructor(@InjectRepository(Token)
              private readonly tokensRepository:Repository<Token>,
  ) {
    super(tokensRepository);
  }

}