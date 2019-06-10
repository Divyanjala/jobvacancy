import {Entity, model, property} from '@loopback/repository';

@model()
export class Field extends Entity {

  @property({
    type: 'string',
    id: true,
  })
  field_id: string;


  @property({
    type: 'string',
  })
  field_type_id: string;

  @property({
    type: 'string',
  })
  field_name: string;

  @property({
    type: 'string',
  })
  field_description: string;

  @property({
    type: 'string',
  })
  field_status: string;
 

  constructor(data?: Partial<Field>) {
    super(data);
  }
}
