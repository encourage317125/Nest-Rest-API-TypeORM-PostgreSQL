import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import * as ormconfig from '../../ormconfig';
import * as ormconfig from '../../../ormconfig';
import { Payment, User, Account, Did, Token, Province, Country } from '../../models';
import { PaymentsRepository } from './repositories/payments.repository'
import { UsersRepository } from './repositories/users.repository'
import { AccountsRepository } from './repositories/accounts.repository'

import { DidsRepository } from './repositories/did.repository';
import { TokensRepository } from './repositories/tokens.repository';
import { CountrysRepository } from './repositories/contries.repository';
import { ProvincesRepository } from './repositories/provinces.repository';
// import { BlacklistsRepository } from './repositories';



@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Payment, User, Account, Did, Token, Province, Country]),
  ],
  controllers: [],
  providers: [PaymentsRepository, AccountsRepository, UsersRepository, DidsRepository, TokensRepository, CountrysRepository, ProvincesRepository, /*BlacklistsRepository*/],
  exports: [PaymentsRepository, AccountsRepository, UsersRepository, DidsRepository, TokensRepository, CountrysRepository, ProvincesRepository, /*BlacklistsRepository*/]

})
export class DBFactoryModule {
}
