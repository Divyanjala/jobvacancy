import {DefaultCrudRepository} from '@loopback/repository';
import {Test} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TestRepository extends DefaultCrudRepository<
  Test,
  typeof Test.prototype.t_d
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Test, dataSource);
  }
}
