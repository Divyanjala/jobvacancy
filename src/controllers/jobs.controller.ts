import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getWhereSchemaFor, patch, put, del, requestBody,HttpErrors } from '@loopback/rest';
import { Jobs } from '../models';
import { JobsRepository } from '../repositories';
import { ResponseProvider } from '../providers/Responses ';


//for delete jobs
class deleteJobs{
  job_id: string
}


//for get all jobs
class allJobs{
  c_id: string;
  perPage:number;
  pageNo:number;
}


export class JobsController {
  responseProvider: ResponseProvider;
  constructor(
    @repository(JobsRepository)
    public jobsRepository: JobsRepository,
  ) {
    this.responseProvider = new ResponseProvider();//create object response Provider
  }


  /**
   * create new job
   * @param jobs 
   */
  @post('/jobs/new', {
    responses: {
      '200': {
        description: 'Jobs model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Jobs } } },
      },
    },
  })
  async create(@requestBody() jobs: Jobs): Promise<any> {
    
    jobs.c_id=jobs.c_id+"A"
    jobs.ex_id=jobs.ex_id+"A"
    //auto create date
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" +(month + 1) + "-" + year;
    jobs.job_register_date=dateString;
  
   //add new job query
    var newJob = await this.jobsRepository.create(jobs);
    if (newJob) {
      return this.responseProvider.callbackWithSuccessMessage(
        'New job was created..!.'
      );
    } else {
      throw new HttpErrors.NotFound('New job was not created..! ');
    }
  }



  /**
   * get all jobs
   * @param where 
   */
  @post('/jobs/all', {
    responses: {
      '200': {
        description: 'Array of Jobs model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Jobs } },
          },
        },
      },
    },
  })
  async find(
    @requestBody() allJobs: allJobs
  ): Promise<any> {
    allJobs.c_id=allJobs.c_id+"A"    
    let skipValue=(allJobs.pageNo-1) * allJobs.perPage;
    let limitValue=allJobs.perPage
 
    
    /**
     * count all data
     */
    var obj={c_id:allJobs.c_id}
    var count=await this.jobsRepository.count(obj);   
      
    var data= await this.jobsRepository.find({order: ['job_id DESC'],"where": { "c_id": allJobs.c_id},"limit":limitValue ,"skip":skipValue});
    return {
      "data":data,
      "paginationLength":count
    };
  }



  /**
   * get all jobs
   * @param where 
   */
  @post('/jobs/all1', {
    responses: {
      '200': {
        description: 'Array of Jobs model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Jobs } },
          },
        },
      },
    },
  })
  async findJob(
    @requestBody() allJobs: allJobs
  ): Promise<any> {
    allJobs.c_id=allJobs.c_id+"A"    
  
    return await this.jobsRepository.find({order: ['job_id DESC'],"where": { "c_id": allJobs.c_id}});
  }



/**
   * get all jobs
   * @param where 
   */
  @get('/jobs/all2', {
    responses: {
      '200': {
        description: 'Array of Jobs model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Jobs } },
          },
        },
      },
    },
  })
  async findAll(): Promise<any> {
    return await this.jobsRepository.find({order: ['job_register_date DESC'] });
  }


  /**
   * get job find by id
   * @param id 
   */
  @post('/jobs/allOne', {
    responses: {
      '200': {
        description: 'Jobs model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Jobs } } },
      },
    },
  })
  async findById(@requestBody() deleteJobs: deleteJobs): Promise<any> {
    return await this.jobsRepository.find({"where": { "job_id": deleteJobs.job_id} });
  }




  @put('/jobs/update', {
    responses: {
      '204': {
        description: 'Jobs PUT success',
      },
    },
  })
  async updateJob(
    @requestBody() jobs: Jobs,
    @param.query.object('where', getWhereSchemaFor(Jobs)) where?: Where,
   
  ): Promise<any> {
    jobs.ex_id=jobs.ex_id+"A"
    jobs.c_id=jobs.c_id+"A"
    var update =  await this.jobsRepository.updateAll(jobs, where);
    if (update) {
      return { data: "Job update success" };
    } else {
      throw new HttpErrors.NotFound('Job update was not success');
    }
  }



/**
  delete jobs
 */
  @post('/jobs/delete', {
    responses: {
      '204': {
        description: 'Jobs DELETE success',
      },
    },
  })
  async deleteById(@requestBody() deleteJobs: deleteJobs): Promise<any> {
    await this.jobsRepository.deleteById(deleteJobs.job_id);
  }
}
