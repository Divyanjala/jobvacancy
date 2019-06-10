import * as nodemailer from "nodemailer"; //set mailPromise
import { inject } from '@loopback/context';
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';//set authentication
import { CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getWhereSchemaFor, put, requestBody, HttpErrors } from '@loopback/rest';
import { Company } from '../models';
import { CompanyRepository } from '../repositories';
import { SuperAdminRepository } from '../repositories'
import { TokenRepository } from '../repositories';
import { JobsRepository } from '../repositories';
import { ExamsRepository } from '../repositories';
import { TokenGenerator } from 'ts-token-generator';
import { senderEmail } from "../config/emailConfig.json";
import { senderEmailPassword } from "../config/emailConfig.json";
import { ResponseProvider } from '../providers/Responses ';
import _ = require("lodash");

var smtpTransport = require('nodemailer-smtp-transport');//for email send
const bcrypt = require('bcrypt');//for hash password
var passwordGen: string;//password auto generate 

//pagination all 
class Pagination{
  perPage:number;
  pageNo:number;
}

//login email temporary class
class loginClass {
  c_email: string;
  c_password: string;
}


//update password for company admin
class updatePassword {
  c_password: string
}

//for update status company admin
class updateStatus {
  c_id: string
  c_status: string
}
//for delete company admin
class deleteStatus {
  c_id: string
  c_status: string
}

//for check email update password
class checkEmail {
  c_email: string
}

//for check token update password
class checktoken {
  c_email: string
  token: string
  c_password: string
}

//for check email update password
class checkProfile {
  c_id: string
}


export class CompanyController {
  job_id = new Array(); //all job_id array
  ex_id = new Array(); //all ex_id array

  responseProvider: ResponseProvider;


  constructor(
    @repository(CompanyRepository) public companyRepository: CompanyRepository,
    @repository(TokenRepository) public tokenRepository: TokenRepository,
    @repository(SuperAdminRepository) public superAdminRepository: SuperAdminRepository,
    @repository(JobsRepository) public jobsRepository: JobsRepository,
    @repository(ExamsRepository) public examsRepository: ExamsRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile,

  ) {
    this.responseProvider = new ResponseProvider();//create object response Provider
  }



  /**
   * Create new company Admin Account
   * @param company 
   */
  // @authenticate('BearerStrategy')
  @post('/company/new', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },

      },
    }
  })

  async create(@requestBody() company: Company, @param.header.string('User_id') User_id?: string): Promise<any> {

    //auto create date
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" + (month + 1) + "-" + year;
    company.c_register_date = dateString;

    //check user role
    var userRole = await this.companyRepository.findById(User_id);
    if (userRole.c_role !== "SUPER_ADMIN") {
      throw new HttpErrors.NotFound('User Not Found');
    }

    //Admin role
    company.c_role = "ADMIN"


    // email validation
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = regexEmail.test(company.c_email);
    if (!result) {
      throw new HttpErrors.NotFound('Email validation error ');
    }

    //check duplicate email
    let companyCheckEmil = await this.companyRepository.find({ "where": { "c_email": company.c_email }, fields: { c_status: true, c_email: true } });

    // filter company object c_status value
    var c_status1;
    var c_email1;
    companyCheckEmil.filter(obj => {
      c_status1 = obj.c_status,
        c_email1 = obj.c_email
    })
    if (c_status1 !== "delete") {
      if (c_email1 == company.c_email) {//check exist email
        throw new HttpErrors.NotFound('Email is already exist ');
      }
    }



    // phone number validation
    var regexPhoneNumber = /^[0-9\+]{1,}[0-9\-]{3,15}$/;
    var result = regexPhoneNumber.test(company.c_contact_num);
    if (!result) {
      throw new HttpErrors.NotFound('Phone number validation error');
    }


    //Password auto generate 
    generator();


    var hashedPassword = await bcrypt.hash(passwordGen, 10); //hasing password
    if (hashedPassword) { // if password hasing success
      company.c_password = hashedPassword;
      company.c_status = 'active';
      await this.companyRepository.create(company); // seving data into db
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
        to: company.c_email,
        subject: "",
        text:"Company registration successful !"+"\n"+ "company user name : "+company.c_name+"\n"+
        "Password : "+passwordGen+"\n\n"+"Thank you.."
      };

      var isMailSend = await transporter.sendMail(mailOptions);
      if (isMailSend) {
        return this.responseProvider.callbackWithSuccessMessage(
          'New Admin was created..!. Login details was send'
        );
      } else {
        throw new HttpErrors.NotFound('New Admin was created, But email sending was failed!');
      }
    }
  }


  /**
   * get all company admin
   * @param filter 
   */
  @authenticate('BearerStrategy')
  @post('/companies/all', {
    responses: {
      '200': {
        description: 'Array of Company model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async find(@requestBody()pagination: Pagination, @param.header.string('User_id') User_id?: string): Promise<any> {
    //check user role
    let skipValue=(pagination.pageNo-1) * pagination.perPage;
    let limitValue=pagination.perPage    
  
    /**
     * count all data
     */
    var obj={c_role:"ADMIN",c_status:"active"}
    var count=await this.companyRepository.count(obj);   

    var userRole = await this.companyRepository.findById(User_id);
    if (userRole.c_role !== "SUPER_ADMIN") {
      throw new HttpErrors.NotFound('User Not Found');
    }

    let data= await this.companyRepository.find({ order: ['c_id DESC'], where: { 'c_status': { nlike: 'delete' },
     'c_role': 'ADMIN' },"limit":limitValue ,"skip":skipValue });
    
    
     return {
      "data":data,
      "paginationLength":count
    };
  }



  /**
   * update company Admin
   * @param company 
   * @param where 
   */
  @authenticate('BearerStrategy')
  @put('/companies/update', {
    responses: {
      '200': {
        description: 'Company PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() company: Company,
    @param.query.object('where', getWhereSchemaFor(Company)) where?: Where,
    @param.header.string('User_id') User_id?: string
  ): Promise<any> {


    //check user role
    var userRole = await this.companyRepository.findById(User_id);
    if (userRole.c_role == "SUPER_ADMIN") {

    } else if (userRole.c_role == "ADMIN") {
      //throw new HttpErrors.NotFound('User Not Found');
    } else {
      throw new HttpErrors.NotFound('User Not Found');
    }

    var update = await this.companyRepository.updateAll(company, where);
    if (update) {
      return { data: "Company update success" };
    } else {
      throw new HttpErrors.NotFound('Company update was not success');
    }
  }


  /**
   * Disable company as update and change status 
   * @param updatestatus 
   */
  @authenticate('BearerStrategy')
  @put('/company/disable', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async disablecompany(@requestBody() updateStatus: updateStatus, @param.header.string('User_id') User_id?: string): Promise<any> {


    //check user role
    var userRole = await this.companyRepository.findById(User_id);
    if (userRole.c_role !== "SUPER_ADMIN") {
      throw new HttpErrors.NotFound('User Not Found');
    }

    var isCompanyHave = await this.companyRepository.findById(updateStatus.c_id);//find company admin
    if (isCompanyHave) {
      if (isCompanyHave.c_status == 'active') {
        updateStatus.c_status = 'disable';
        // update query
        await this.companyRepository.updateById(updateStatus.c_id, updateStatus);
        return { data: "company Disable success" };
      } else if (isCompanyHave.c_status == 'disable') {
        updateStatus.c_status = 'active';
        // update query
        await this.companyRepository.updateById(updateStatus.c_id, updateStatus);
        return { data: "Company Active success" };
      } else {
        throw new HttpErrors.NotFound('This is account was deleted or not fount!');
      }
    } else {
      throw new HttpErrors.NotFound('Company not found!');
    }

  }



  /**
    * Delete company as update and change status 
    * @param company 
    */
  @authenticate('BearerStrategy')
  @put('/company/delete', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Company } } },
      },
    },
  })
  async deletecompany(@requestBody() deleteStatus: deleteStatus,
    @param.query.object('where', getWhereSchemaFor(Company)) where?: Where, @param.header.string('User_id') User_id?: string): Promise<any> {

    //check user role
    var userRole = await this.companyRepository.findById(User_id);
    if (userRole.c_role !== "SUPER_ADMIN") {
      throw new HttpErrors.NotFound('User Not Found');
    }

    deleteStatus.c_status = 'delete'
    var new_cid = deleteStatus.c_id + "A"

    let deleteJob = await this.jobsRepository.find({ "where": { "c_id": new_cid }, fields: { job_id: true } });//get job id for this company


    deleteJob.filter(obj => {//filter job id
      var new_id = obj.job_id
      this.job_id.push(new_id);
    })


    //delete job for this company
    for (let index = 0; index < this.job_id.length; index++) {
      await this.jobsRepository.deleteById(this.job_id[index]);
    }



    let deleteExam = await this.examsRepository.find({ "where": { "c_id": new_cid }, fields: { ex_id: true } });//get exam id for this company

    deleteExam.filter(obj => {//filter exam id
      var new_id = obj.ex_id
      this.ex_id.push(new_id);
    })

    //delete exam for this company
    for (let index = 0; index < this.ex_id.length; index++) {
      await this.examsRepository.deleteById(this.ex_id[index]);
    }

    deleteStatus.c_id = deleteStatus.c_id
    await this.companyRepository.updateById(deleteStatus.c_id, deleteStatus);

  }



  /**
   * check email admin reset password
   * @param email 
   */
  // @authenticate('BearerStrategy')
  @post('/companies/checkEmail', {
    responses: {
      '204': {
        description: 'Company email true',
      },
    },
  })
  async checkByEmail(@requestBody() checkEmail: checkEmail): Promise<any> {


    //check duplicate token
    let emailToken = await this.tokenRepository.find({ "where": { "c_email": checkEmail.c_email } });

    var c_email1;
    emailToken.filter(obj => {//filter value
      c_email1 = obj.c_email
    })

    if (c_email1 == checkEmail.c_email) {
      await this.tokenRepository.deleteById(checkEmail.c_email);//delete duplicate token
    }

    //find email
    let admin = await this.companyRepository.findOne({ "where": { "c_email": checkEmail.c_email } });
    if (!admin) {
      throw new HttpErrors.NotFound('Email is invalid');
    }

    //generate token
    const token = new TokenGenerator(); // Default is a 128-bit token encoded in base58
    var newToken = token.generate();
    var tokenClass = {
      c_email: checkEmail.c_email,
      token: newToken
    };

    // add token
    var a = await this.tokenRepository.create(tokenClass);

    // send to token for email
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
      to: checkEmail.c_email,
      subject: "token",
      text: newToken
    };

    const email = checkEmail.c_email
    var isMailSend = await transporter.sendMail(mailOptions);
    if (isMailSend) {
      return {
        "email": email
      }
    } else {
      throw new HttpErrors.NotFound('New Token was created, But email sending was failed!');
    }
  }



  /**
   * check token is match
   * @param token1 
   */
  //  @authenticate('BearerStrategy')
  @put('/companies/checkTokenAndUpadatePassword', {
    responses: {
      '204': {
        description: 'Company token true',
      },
    },
  })
  async checkByToken(@requestBody() checktoken: checktoken): Promise<any> {

    //find token and match
    let checkToken = await this.tokenRepository.find({ "where": { "c_email": checktoken.c_email } });

    var newEmail
    var newToken
    checkToken.filter(obj => {
      newEmail = obj.c_email,
        newToken = obj.token
    })

    if (newEmail == checktoken.c_email) {
      if (newToken == checktoken.token) {
        //password hash
        const salt = await bcrypt.genSalt(10);
        checktoken.c_password = await bcrypt.hash(checktoken.c_password, salt);
        if (!checktoken.c_password) {
          throw new HttpErrors.BadRequest('Password not hash');
        }

        //change password object
        var changePassword = {
          c_password: checktoken.c_password
        };

        //where object
        var where = {
          c_email: checktoken.c_email
        };

        var update = await this.companyRepository.updateAll(changePassword, where);
        if (update) {
          return this.responseProvider.callbackWithSuccessMessage(
            'Password updated..!'
          );
        } else {
          throw new HttpErrors.BadRequest('Password not update');
        }
      } else {
        throw new HttpErrors.NotFound('Token is invalid .... ');
      }
    } else {
      throw new HttpErrors.NotFound('Account not found for this provider email address');
    }
  }







  /**
   * get company details for admin
   * @param filter 
   */
  // @authenticate('BearerStrategy')
  @post('/companies/profile', {
    responses: {
      '200': {
        description: 'Array of Company model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async findDetails(@requestBody() checkProfile: checkProfile): Promise<Company[]> {
    //check user role

    return await this.companyRepository.find({ where: { 'c_id': checkProfile.c_id } });
  }

}



/**
 * password generator function
 */
function generator() {
  var generator = require('generate-password');
  passwordGen = generator.generate({
    length: 10,
    numbers: true
  });
}
