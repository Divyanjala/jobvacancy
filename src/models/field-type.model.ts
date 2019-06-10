import {Entity, model, property} from '@loopback/repository';

@model()
export class FieldType extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  field_type_id?: string;

  @property({
    type: 'string',
    required: true,
  })
  field_type: string;

  @property({
    type: 'string',
    required: true,
  })
  field_description: string;


  constructor(data?: Partial<FieldType>) {
    super(data);
  }
}
