import {DefaultCrudRepository} from '@loopback/repository';
import {Users} from '../models';
import {Job_vacancyDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.u_id
> {
  constructor(
    @inject('datasources.job_vacancy') dataSource: Job_vacancyDataSource,
  ) {
    super(Users, dataSource);
  }
}
