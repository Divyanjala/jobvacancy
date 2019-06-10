import {repository,Where} from '@loopback/repository';
import {post,param,get,put, requestBody,HttpErrors,getWhereSchemaFor} from '@loopback/rest';
import { ApplyJob } from '../models';
import { ApplyJobRepository } from '../repositories';
import * as nodemailer from "nodemailer"; //set mailPromise
import { senderEmail } from "../config/emailConfig.json";
import { senderEmailPassword } from "../config/emailConfig.json";

var smtpTransport = require('nodemailer-smtp-transport');//for email send

//for delete jobs
class getJobs{
  job_id: string;
  perPage:number;
  pageNo:number;
}

//for delete jobs
class getAllJob{
  c_id: string
  job_id:string
}

//for update status company admin
class updateStatus {
  status: string
  mail:string
  email: string
}

export class ApplyJobController {
  constructor(
    @repository(ApplyJobRepository)
    public applyJobRepository: ApplyJobRepository,
  ) { }



  @post('/apply-jobs/new', {
    responses: {
      '200': {
        description: 'ApplyJob model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ApplyJob } } },
      },
    },
  })
  async create(@requestBody() applyJob: ApplyJob): Promise<any> {
    applyJob.job_id=applyJob.job_id+"A";
    applyJob.c_id=applyJob.c_id+"A";
     //regex email validate
     var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
     var result = regexEmail.test(applyJob.email);
     if (result == false) {
       throw new HttpErrors.NotFound('email validation error');
     }

       // phone number validation
    var regexPhoneNumber = /^[0-9\+]{1,}[0-9\-]{3,15}$/;
    var result = regexPhoneNumber.test(applyJob.telephone);
    if (!result) {
      throw new HttpErrors.NotFound('Phone number validation error');
    }
    
    //check duplicate email
    var email= await this.applyJobRepository.find({"where": { "email": applyJob.email ,"job_id": applyJob.job_id}});
    var cuurentEmail;
    email.filter(obj => {//filter email
      cuurentEmail = obj.email
    })

    if (cuurentEmail==applyJob.email ) {
      throw new HttpErrors.NotFound('Email is already exist');
    }

    return await this.applyJobRepository.create(applyJob);
   
  }



/**
 * get all applyJobs
 * @param filter 
 */
  @post('/apply-jobs/all', {
    responses: {
      '200': {
        description: 'Array of ApplyJob model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ApplyJob } },
          },
        },
      },
    },
  })
  async find(@requestBody() getJobs:getJobs): Promise<any> {
    getJobs.job_id=getJobs.job_id+"A";
   
    let skipValue=(getJobs.pageNo-1) * getJobs.perPage;
    let limitValue=getJobs.perPage
 
    
    /**
     * count all data
     */
    var obj={job_id:getJobs.job_id}
    var count=await this.applyJobRepository.count(obj);   
    let data=await this.applyJobRepository.find({"where": { "job_id": getJobs.job_id} ,"limit":limitValue ,"skip":skipValue});

    return {
      "data":data,
      "paginationLength":count
    };
  }

  /**
 * get all applyJobs
 * @param filter 
 */
@post('/apply-jobs/allOne', {
  responses: {
    '200': {
      description: 'Array of ApplyJob model instances',
      content: {
        'application/json': {
          schema: { type: 'array', items: { 'x-ts-type': ApplyJob } },
        },
      },
    },
  },
})
async findJob(@requestBody() getAllJob:getAllJob): Promise<any> {
  getAllJob.c_id=getAllJob.c_id+"A";
  getAllJob.job_id=getAllJob.job_id+"A";
  return await this.applyJobRepository.find({"where": { "c_id": getAllJob.c_id ,"job_id": getAllJob.job_id}});
}


  @get('/apply-jobs/{id}', {
    responses: {
      '200': {
        description: 'ApplyJob model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ApplyJob } } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<ApplyJob> {
    return await this.applyJobRepository.findById(id);
  }


/**
 * send mail
 * @param id 
 * @param applyJob 
 */
  @put('/apply-jobs/update', {
    responses: {
      '204': {
        description: 'ApplyJob PUT success',
        content: { 'application/json': { schema: { 'x-ts-type': ApplyJob } } },
      },
    },
  })
  async replaceById(@requestBody() updateStatus: updateStatus, @param.query.object('where', getWhereSchemaFor(ApplyJob)) where?: Where): Promise<void> {

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
      to: updateStatus.email,
      subject: "",
      text: updateStatus.mail
    };

    var isMailSend = await transporter.sendMail(mailOptions);
    await this.applyJobRepository.updateAll(updateStatus ,where);
  }


}
