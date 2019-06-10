import * as nodemailer from "nodemailer";
var smtpTransport = require('nodemailer-smtp-transport');
import { inject } from '@loopback/context';
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { post, param, del, requestBody, HttpErrors } from '@loopback/rest';
import { Company } from '../models';
import { CompanyRepository } from '../repositories';
import { senderEmail } from "../config/emailConfig.json";
import { senderEmailPassword } from "../config/emailConfig.json";
import { ResponseProvider } from '../providers/response.provider';
const _ = require('lodash');
const bcrypt = require('bcrypt');

//login email temporary class
class cradintionClass {
  c_email: string;
  c_password: string;
}

export class SuperAdminController {
  responseProvider: ResponseProvider;
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile,
    @repository(CompanyRepository) public CompanyRepository: CompanyRepository

  ) {
    this.responseProvider = new ResponseProvider();//create responseProvider object
  }

  /**
   * super Admin login
   * @param cradintionClass 
   */
  @post('/login', {
    responses: {
      '200': {
        description: 'login',
      },
    },
  })
  async login(@requestBody() cradintionClass: cradintionClass): Promise<object> {
    let loginRole = await this.CompanyRepository.find({ "where": { "c_email": cradintionClass.c_email } });
    // filter company object c_status value
    var c_role;
    loginRole.filter(obj => {
      c_role = obj.c_role
    })


 // compare email
    var Admin
    if (c_role == "ADMIN") {
      Admin = await this.CompanyRepository.findOne({ "where": { "c_email": cradintionClass.c_email ,"c_status":"active"} });
    }else{
      Admin = await this.CompanyRepository.findOne({ "where": { "c_email": cradintionClass.c_email } });
    }
    

    if (!Admin) {
      throw new HttpErrors.NotFound('Account not found for the provided email address');
    } if (Admin.c_status == "delete") {
      throw new HttpErrors.NotFound('This account was delete');
    }
    //compare password
    const validPassword = await bcrypt.compare(cradintionClass.c_password, Admin.c_password);
    if (!validPassword) {
      throw new HttpErrors.NotFound('Invalid password');
    }
    // create token
    const email = Admin.c_email
    const role = Admin.c_role
    const id = Admin.c_id
    const token = Admin.generateAuthToken();
    return {
      "token": token,
      "email": email,
      "role": role,
      "id": id
    }
  }
  /**
   * create new profile super Admin
   * @param superAdmin 
   */
  @post('/super-admins/new', {
    responses: {
      '200': {
        description: 'SuperAdmin model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async create(@requestBody() Company: Company): Promise<any> {
    // count super Admin profile
    let count1 = await this.CompanyRepository.count();
    if (count1.count >= 1) {
      return this.responseProvider.callbackWithErrorMessage(
        'Bad Request',
        'Super admin have a profile',
        400,
      );
    }
    //regex email validate
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = regexEmail.test(Company.c_email);
    if (result == false) {
      return this.responseProvider.callbackWithErrorMessage(
        'Bad Request',
        'email validation error',
        400,
      );
    }
    //regex password validate
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var result = regex.test(Company.c_password);
    if (result == false) {
      return this.responseProvider.callbackWithErrorMessage(
        'Bad Request',
        'Password minimum 8 characters, at least one letter and one number:',
        400,
      );
    }
    //role handle
    Company.c_role = "SUPER_ADMIN";
    if (!Company.c_role) {
      return this.responseProvider.callbackWithErrorMessage(
        'Bad Request',
        'User role is not insert',
        400,
      );
    }
    //password hash
    var password = Company.c_password
    const salt = await bcrypt.genSalt(10);
    Company.c_password = await bcrypt.hash(Company.c_password, salt);
    if (!Company.c_password) {
      return this.responseProvider.callbackWithErrorMessage(
        'Hash error',
        'Password not hash',
        400,
      );
    }
    Company = await this.CompanyRepository.create(Company);//save admin to database
    if (Company) {
      // Use Smtp Protocol to send Email
      var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: senderEmail,
          pass: senderEmailPassword
        }
      }));
      var mailOptions = {
        from: senderEmail,
        to: Company.c_email,
        subject: "your password",
        text: password
      };
      var isMailSend = await transporter.sendMail(mailOptions);
      if (!isMailSend) {
        return this.responseProvider.callbackWithErrorMessage(
          'Email send error',
          'SuperAdmin was created but email is not send',
          400,
        );
      }
      return this.responseProvider.callbackWithSuccessData(
        _.pick(Company, ['id', 'email', 'role']),
      );
    } else {
      return this.responseProvider.callbackWithErrorMessage(
        'Data not insert ',
        'User Account was not created',
        409,
      );
    }
  }

  /**
   * Delete profile super Admin
   * @param id 
   */
  @authenticate('BearerStrategy')
  @del('/super-admins/{id}', {
    responses: {
      '204': {
        description: 'SuperAdmin DELETE success',
      },
    },
  })
  async deletById(@param.path.number('id') id: string): Promise<void> {
    await this.CompanyRepository.deleteById(id);
  }
}
