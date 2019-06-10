import {DefaultCrudRepository} from '@loopback/repository';
import {Exams} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ExamsRepository extends DefaultCrudRepository<
  Exams,
  typeof Exams.prototype.ex_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Exams, dataSource);
  }
}
