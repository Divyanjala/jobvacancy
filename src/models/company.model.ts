import { Entity, model, property } from '@loopback/repository';
const jwt=require("jsonwebtoken");


@model()
export class Company extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  c_id?: string;

  @property({
    type: 'string',
  })
  c_name: string;

  @property({
    type: 'string',
  })
  c_register_num?: string;

  @property({
    type: 'string',
  })
  c_contact_num: string;

  @property({
    type: 'string',
  })
  c_email: string;

  @property({
    type: 'string',
  })
  c_type: string;

  @property({
    type: 'string',
  })
  c_address: string;

  @property({
    type: 'string',
  })
  c_description: string;

  @property({
    type: 'string',
  })
  c_package_type?: string;

  @property({
    type: 'string',
  })
  c_password: string;

  @property({
    type: 'string'
  })
  c_register_date: string;

  @property({
    type: 'string',
  })
  c_status: string;
  
  @property({
    type: 'string',
  })
  c_role: string;
  
  generateAuthToken(){
    const token=jwt.sign({c_id:this.c_id,c_name:this.c_name,c_register_num:this.c_register_num},"TheVerySecurePrivateKey");
    return token;
  }
  constructor(data?: Partial<Company>) {
    super(data);
  }
}
