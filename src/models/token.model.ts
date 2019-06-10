import {Entity, model, property} from '@loopback/repository';

@model()
export class Token extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  c_email: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;


  constructor(data?: Partial<Token>) {
    super(data);
  }
}
