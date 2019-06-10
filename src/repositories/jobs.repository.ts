import {DefaultCrudRepository} from '@loopback/repository';
import {Jobs} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class JobsRepository extends DefaultCrudRepository<
  Jobs,
  typeof Jobs.prototype.job_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Jobs, dataSource);
  }
}
