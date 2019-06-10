import { DefaultCrudRepository } from '@loopback/repository';
import { SuperAdmin } from '../models';
import { Job_vacancyDataSource } from '../datasources';
import { inject } from '@loopback/core';
export class SuperAdminRepository extends DefaultCrudRepository<
  SuperAdmin,
  typeof SuperAdmin.prototype.id
  > {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(SuperAdmin, dataSource);
  }
}
