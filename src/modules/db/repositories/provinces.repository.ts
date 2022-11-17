import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from '../../../models';


@Injectable()
export class ProvincesRepository extends BaseAbstractRepository<Province>  {

  constructor(@InjectRepository(Province)
              private readonly provincesRepository:Repository<Province>,
  ) {
    super(provincesRepository);
  }

}