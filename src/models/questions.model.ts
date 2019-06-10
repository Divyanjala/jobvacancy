import {Entity, model, property} from '@loopback/repository';

@model()
export class Questions extends Entity {


  @property({
    type: 'string',
    id: true
  })
  q_id: string;

  @property({
    type: 'string',
    required: true,
  })
  field_id: string;

  @property({
    type: 'string',
    required: true,
  })
  question: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  allAnswer: string[];

  @property({
    type: 'number',
    required: true,
  })
  trueAnswer: number;

  @property({
    type: 'string'
  })
  role: string;

  constructor(data?: Partial<Questions>) {
    super(data);
  }
}
