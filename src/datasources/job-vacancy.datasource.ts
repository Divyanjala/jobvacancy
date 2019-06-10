import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './job-vacancy.datasource.json';

export class Job_vacancyDataSource extends juggler.DataSource {
  static dataSourceName = 'job_vacancy';

  constructor(
    @inject('datasources.config.job_vacancy', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
