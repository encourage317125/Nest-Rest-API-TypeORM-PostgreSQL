import { BaseAbstractRepository } from './base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../../../models';


@Injectable()
export class CountrysRepository extends BaseAbstractRepository<Country>  {

  constructor(@InjectRepository(Country)
              private readonly countriesRepository:Repository<Country>,
  ) {
    super(countriesRepository);
  }

}