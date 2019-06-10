import {  repository } from '@loopback/repository';
import { post, param,  patch, requestBody, HttpErrors } from '@loopback/rest';
import { Exams } from '../models';
import { ExamsRepository } from '../repositories';
import { JobsRepository } from '../repositories';


//fore get all exam
class exam {
  c_id: string;
  perPage:number;
  pageNo:number;
}

//fore get all field for exam
class examField {
  c_id: string
  field_id: string
  perPage:number;
  pageNo:number;
}

//delete exam
class examDelete {
  ex_id: string
}


export class ExamsController {
  constructor(
    @repository(ExamsRepository)public examsRepository: ExamsRepository,
    @repository(JobsRepository)public jobsRepository: JobsRepository,
  ) { }

  /**
   * create new exam
   * @param exams 
   */
  @post('/exams/new', {
    responses: {
      '200': {
        description: 'Exams model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Exams } } },
      },
    },
  })
  async create(@requestBody() exams: Exams): Promise<any> {
    //add character for c_id
    exams.c_id = exams.c_id + "A";
    exams.field_id=exams.field_id+"A";

    var exams = await this.examsRepository.create(exams);
    if (exams) {
      return { data: "New Exam was successfully insert" };
    } else {
      throw new HttpErrors.NotFound("Exam not insert ");
    }
  }


  /**
   * get all exam where field_id
   * @param exam 
   */
  @post('/exams/allExam', {
    responses: {
      '200': {
        description: 'Exams model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Exams } } },
      },
    },
  })
  async find(@requestBody() examField: examField): Promise<any> {
    
    examField.field_id = examField.field_id + "A"
    let skipValue=(examField.pageNo-1) * examField.perPage;
    let limitValue=examField.perPage

     /**
     * count all data
     */
    var obj={
      c_id:examField.c_id,
      field_id:examField.field_id
    }
    var count=await this.examsRepository.count(obj);  
 
    let data= await this.examsRepository.find({ where: { "c_id": examField.c_id ,"field_id":examField.field_id}
    ,"limit":limitValue ,"skip":skipValue });

    return {
      "data":data,
      "paginationLength":count
    };
  }


  /**
   * get all exam where field_id
   * @param exam 
   */
  @post('/exams/allExam2', {
    responses: {
      '200': {
        description: 'Exams model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Exams } } },
      },
    },
  })
  async findAllExam(@requestBody() examField: examField): Promise<any> {
    
    examField.field_id = examField.field_id + "A"
 
    return await this.examsRepository.find({ where: { "c_id": examField.c_id ,"field_id":examField.field_id}});
  }



  /**
   * get all exam 
   * @param exam 
   */
  @post('/exams/all', {
    responses: {
      '200': {
        description: 'Exams model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Exams } } },
      },
    },
  })
  async findExams(@requestBody() exam: exam): Promise<any> {
    exam.c_id = exam.c_id + "A"


    let skipValue=(exam.pageNo-1) * exam.perPage;
    let limitValue=exam.perPage
 
    
    /**
     * count all data
     */
    var obj={c_id:exam.c_id}
    var count=await this.examsRepository.count(obj);  

    let data= await this.examsRepository.find({order: ['ex_id DESC'], where: { "c_id": exam.c_id } 
     ,"limit":limitValue ,"skip":skipValue});


    return {
      "data":data,
      "paginationLength":count
    };
  }




  /**
   * get one exam for ex_id
   * @param examDelete 
   */
  @post('/exams/one', {
    responses: {
      '200': {
        description: 'Exams model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Exams } } },
      },
    },
  })
  async findExam(@requestBody() examDelete: examDelete): Promise<any> {
    return await this.examsRepository.find({ "where": { "ex_id": examDelete.ex_id } });
  }




  @patch('/exams/{id}', {
    responses: {
      '204': {
        description: 'Exams PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() exams: Exams,
  ): Promise<void> {
    await this.examsRepository.updateById(id, exams);
  }


  /**
   * delete exam
   * @param examDelete 
   */
  @post('/exams/delete', {
    responses: {
      '204': {
        description: 'Exams DELETE success',
      },
    },
  })
  async deleteById(@requestBody() examDelete: examDelete, ): Promise<any> {
    //find exam for use jobs
    var eid=examDelete.ex_id+"A";
    var job= await this.jobsRepository.find({"where": { "ex_id":eid} });

    //get object value
    var current_ex_id;;
    job.filter(obj => {
      current_ex_id=obj.ex_id
    })

    if (current_ex_id==eid) {
      throw new HttpErrors.NotFound("This exam used for the job");
    } else {
       await this.examsRepository.deleteById(examDelete.ex_id);
    }
    
  }
}
