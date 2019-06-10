import {DefaultCrudRepository} from '@loopback/repository';
import {ApplyJob} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ApplyJobRepository extends DefaultCrudRepository<
  ApplyJob,
  typeof ApplyJob.prototype.a_job_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(ApplyJob, dataSource);
  }
}
