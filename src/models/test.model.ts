import {Entity, model, property} from '@loopback/repository';

@model()
export class Test extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  t_d?: string;

  @property({
    type: 'string',
    required: true,
  })
  ex_id: string;

  @property({
    type: 'string',
    required: true,
  })
  a_job_id: string;

  @property({
    type: 'string',
    required: true,
  })
  time_type: string;

  @property({
    type: 'number',
    required: true,
  })
  percentage: number;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  t_question: object[];

  @property({
    type: 'number'
  })
  time: number;


  constructor(data?: Partial<Test>) {
    super(data);
  }
}
