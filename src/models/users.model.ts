import {Entity, model, property} from '@loopback/repository';

@model()
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  u_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  u_name: string;

  @property({
    type: 'string',
    required: true,
  })
  u_password: string;

  @property({
    type: 'string',
    required: true,
  })
  u_email: string;


  @property({
    type: 'string',
    required: true,
  })
  u_role: string;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}
