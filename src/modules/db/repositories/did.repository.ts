import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Did } from '../../../models';



@Injectable()
export class DidsRepository extends BaseAbstractRepository<Did>  {

  constructor(@InjectRepository(Did)
              private readonly didRepository:Repository<Did>,
  ) {
    super(didRepository);
  }

}