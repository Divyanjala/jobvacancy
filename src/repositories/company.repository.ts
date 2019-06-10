import {DefaultCrudRepository} from '@loopback/repository';
import {Company} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.c_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Company, dataSource);
  }
}
