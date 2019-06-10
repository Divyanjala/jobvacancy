import {Provider, inject, ValueOrPromise} from '@loopback/context';
import {Strategy as BearerStrategy} from 'passport-http-bearer';
import {Strategy} from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
  UserProfile,
} from '@loopback/authentication';
import {BasicStrategy} from 'passport-http';
import { SuperAdminRepository } from '../repositories';
import { repository } from '@loopback/repository';
const jwt=require("jsonwebtoken");
 
export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)private metadata: AuthenticationMetadata,
    @repository(SuperAdminRepository)public superAdminRepository : SuperAdminRepository
  ) {}
 
  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }
 
    const name = this.metadata.strategy;
    //authentication type
    if (name === 'BearerStrategy') {
      return new BearerStrategy(this.verify.bind(this));
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }
 
  verify(
    token: string,
    cb: (err: Error | null, superAdmin?: object | false) => void,
  ) {
    try {
      const user=jwt.verify(token,'TheVerySecurePrivateKey');//check token
      cb(null,user)
    } catch (ex) {
      cb(null,false)
    }
  }
}