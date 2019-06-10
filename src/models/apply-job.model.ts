import {Entity, model, property} from '@loopback/repository';

@model()
export class ApplyJob extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  a_job_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  job_id: string;

  @property({
    type: 'string',
    required: true,
  })
  c_id: string;

  @property({
    type: 'string',
    required: true,
  })
  full_name: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  telephone: string;

  @property({
    type: 'string',
    required: true,
  })
  optional: string;

  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'string',
  })
  mail: string;

  constructor(data?: Partial<ApplyJob>) {
    super(data);
  }
}
