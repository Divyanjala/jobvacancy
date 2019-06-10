import {Entity, model, property} from '@loopback/repository';

@model()
export class Jobs extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  c_id: string;

  @property({
    type: 'string',
    id: true,
  })
  job_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  ex_id: string;

  @property({
    type: 'string',
    required: true,
  })
  f_id: string;

  @property({
    type: 'string',
    required: true,
  })
  job_position: string;

  @property({
    type: 'string',
    
  })
  job_register_date: string;

  @property({
    type: 'string',
    required: true,
  })
  job_description: string;


  constructor(data?: Partial<Jobs>) {
    super(data);
  }
}
