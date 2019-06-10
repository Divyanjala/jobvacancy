import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getWhereSchemaFor, patch, HttpErrors, del, requestBody, } from '@loopback/rest';
import { Users } from '../models';
import { Company } from '../models';
import { CompanyRepository } from '../repositories';
import { ResponseProvider } from '../providers/Responses ';

const bcrypt = require('bcrypt');//for hash password

export class UsersController {
  responseProvider: ResponseProvider;
  constructor(@repository(CompanyRepository) public companyRepository: CompanyRepository) {
    this.responseProvider = new ResponseProvider();//create object response Provider
  }



  /**
   * create new user
   * @param users 
   */
  @post('/users/new', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async create(@requestBody() Company: Company): Promise<any> {

    //regex email validate
    var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var result = regexEmail.test(Company.c_email);
    if (result == false) {
      throw new HttpErrors.NotFound('email validation error');
     
    }

   


    //check duplicate email
    let checkEmil = await this.companyRepository.find({ "where": { "c_email": Company.c_email } });
    
    
    // filter company object c_status value
    var c_email1;
    checkEmil.filter(obj => {
      c_email1 = obj.c_email
    })
    if (c_email1 == Company.c_email) {//check exist email
      throw new HttpErrors.NotFound('Email is already exist ');
    }



    //role handle
    Company.c_role = "USER";
    
    if (!Company.c_role) {
      throw new HttpErrors.NotFound('user role is not insert');
    
    }

    //password hash
    const salt = await bcrypt.genSalt(10);
    Company.c_password = await bcrypt.hash(Company.c_password, salt);
    if (!Company.c_password) {
      throw new HttpErrors.NotFound('password not hash');
     ;
    }
    Company = await this.companyRepository.create(Company);//save admin to database
    if (Company) {
      return this.responseProvider.callbackWithSuccessMessage(
        'New user was created..!'
      );
    } else {
      return this.responseProvider.callbackWithErrorMessage(
        'Data not insert ',
        'User Account was not created',
        409,
      );
    }
  }




  @get('/users/count', {
    responses: {
      '200': {
        description: 'Users model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where,
  ): Promise<Count> {
    return await this.companyRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of Users model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Company)) filter?: Filter,
  ): Promise<Company[]> {
    return await this.companyRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'Users PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() users: Users,
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where,
  ): Promise<Count> {
    return await this.companyRepository.updateAll(users, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'Users model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Company> {
    return await this.companyRepository.findById(id);
  }




  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'Users DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.companyRepository.deleteById(id);
  }
}
