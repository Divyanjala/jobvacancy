import {Entity, model, property} from '@loopback/repository';

@model()
export class Exams extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  c_id: string;

  @property({
    type: 'string',
    required: true,
  })
  field_id: string;

  @property({
    type: 'string',
    id: true,
    
  })
  ex_id: string;

  @property({
    type: 'string',
    required: true,
  })
  ex_name: string;

  @property({
    type: 'string',
    required: true,
  })
  ex_description: string;

  @property({
    type: 'string',
    required: true,
  })
  ex_type: string;

  @property({
    type: 'string',
    required: true,
  })
  time_type: string;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  question: object[];

  @property({
    type: 'number',
  })
  time?: number;


  constructor(data?: Partial<Exams>) {
    super(data);
  }
}
