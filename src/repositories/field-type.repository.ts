import {DefaultCrudRepository} from '@loopback/repository';
import {FieldType} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FieldTypeRepository extends DefaultCrudRepository<
  FieldType,
  typeof FieldType.prototype.field_type_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(FieldType, dataSource);
  }
}
