import {DefaultCrudRepository} from '@loopback/repository';
import {Field} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FieldRepository extends DefaultCrudRepository<
  Field,
  typeof Field.prototype.field_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Field, dataSource);
  }
}
