import {DefaultCrudRepository} from '@loopback/repository';
import {Questions} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class QuestionsRepository extends DefaultCrudRepository<
  Questions,
  typeof Questions.prototype.q_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Questions, dataSource);
  }
}
