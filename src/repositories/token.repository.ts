import {DefaultCrudRepository} from '@loopback/repository';
import {Token} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TokenRepository extends DefaultCrudRepository<
  Token,
  typeof Token.prototype.c_email
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Token, dataSource);
  }
}
