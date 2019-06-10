import {Entity, model, property} from '@loopback/repository';
const jwt=require("jsonwebtoken");


@model()
export class SuperAdmin extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  role: string;
  constructor(data?: Partial<SuperAdmin>) {
    super(data);
  }

  generateAuthToken(){
    const token=jwt.sign({id:this.id,email:this.email},"TheVerySecurePrivateKey");
    return token;
  }
}
