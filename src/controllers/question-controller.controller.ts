
import { Filter, repository, CountSchema, Where } from '@loopback/repository';
import { inject } from '@loopback/context';
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';
import { post, param, get, getFilterSchemaFor, getWhereSchemaFor, del, requestBody, HttpErrors, put } from '@loopback/rest';
import { Questions } from '../models';
import { QuestionsRepository } from '../repositories';
import { FieldRepository } from '../repositories';
import { ResponseProvider } from '../providers/Responses ';
import { ExamsRepository } from '../repositories';


//for get field
class Field {
  field_type_id: string;
  perPage: number;
  pageNo: number;
}


// for get all questions
class getField_id {
  field_id: string;
  perPage: number;
  pageNo: number;
}

//for delete field_type
class deleteQuestion {
  q_id: string
}


export class QuestionControllerController {
  q_id: string;
  array: any;
  array2 = new Array();
  question: any;
  responseProvider: ResponseProvider;
  constructor(
    @repository(QuestionsRepository) public questionsRepository: QuestionsRepository,
    @repository(FieldRepository) public fieldRepository: FieldRepository,
    @repository(ExamsRepository) public examsRepository: ExamsRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile,//Authentication handle
  ) {
    this.responseProvider = new ResponseProvider();//create object response Provider
  }



  /**
  * create Question super Admin
  * @param questions 
  */
  @post('/questions/new', {
    responses: {
      '200': {
        description: 'Questions model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Questions } } },
      },
    },
  })
  async create(@requestBody() questions: Questions): Promise<any> {

    questions.field_id = questions.field_id + "A"; // create new relational field_id

    await this.questionsRepository.create(questions);//query create
    return this.responseProvider.callbackWithSuccessMessage(
      'New Question was created..!'
    );
  }




  /**
   * find all questions
   * @param filter 
   */
  @post('/questions/all', {
    responses: {
      '200': {
        description: 'Array of Questions model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Questions } },
          },
        },
      },
    },
  })
  async find(@requestBody() getField_id: getField_id): Promise<any> {
    getField_id.field_id = getField_id.field_id + "A";

    //check user role
    let skipValue = (getField_id.pageNo - 1) * getField_id.perPage;
    let limitValue = getField_id.perPage


    /**
   * count all data
   */
    let obj = {
      field_id: getField_id.field_id
    }
    var count = await this.questionsRepository.count(obj);
    let data = await this.questionsRepository.find({
      order: ['q_id DESC'], where: { "field_id": getField_id.field_id },
      "limit": limitValue, "skip": skipValue
    });
      
    
    return {
      "data": data,
      "paginationLength": count
    };
  }



  /**
   * find all questions
   * @param filter 
   */
  @post('/questions/all1', {
    responses: {
      '200': {
        description: 'Array of Questions model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Questions } },
          },
        },
      },
    },
  })
  async findQuestion(@requestBody() getField_id: getField_id): Promise<any> {
    getField_id.field_id = getField_id.field_id + "A";
    
    return await this.questionsRepository.find({order: ['q_id DESC'], where: { "field_id": getField_id.field_id }});
      
  
  }



  /**
 * find one questions
 * @param filter 
 */
  @post('/questions/one', {
    responses: {
      '200': {
        description: 'Array of Questions model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Questions } },
          },
        },
      },
    },
  })
  async findOne(@requestBody() deleteQuestion: deleteQuestion): Promise<any> {
    return await this.questionsRepository.findOne({ "where": { "q_id": deleteQuestion.q_id } });
  }




  /**
   * update questions 
   * @param questions 
   * @param where 
   */
  @authenticate('BearerStrategy')
  @put('/questions/update', {
    responses: {
      '200': {
        description: 'Questions PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() questions: Questions,
    @param.query.object('where', getWhereSchemaFor(Questions)) where?: Where,
  ): Promise<any> {

    var update = await this.questionsRepository.updateAll(questions, where);//update query
    if (update) {
      return { data: "questions update success" };
    } else {
      throw new HttpErrors.NotFound('questions update was not success');
    }
  }




  /** This rout is not complete
   * 
   * 
   * Delete Question
   * @param id 
   */

  @post('/questions/delete', {
    responses: {
      '204': {
        description: 'Questions DELETE success',
      },
    },
  })
  async deleteById(@requestBody() deleteQuestion: deleteQuestion): Promise<any> {



    var checkField = await this.examsRepository.find();//check field


    //get object value
    var fields_id_new;
    checkField.filter(obj => {
      this.array = obj.question
      this.array2.push(this.array);
    })

    //get question id
    for (let index = 0; index < this.array2.length; index++) {
      this.array2.filter(obj => {
        for (let index = 0; index < obj.length; index++) {
          this.question = obj[index]
          if (deleteQuestion.q_id == this.question.q_id) {
            throw new HttpErrors.NotFound("question  used for exam");
          }
        }
      })
    }


    var deleQuestion = await this.questionsRepository.deleteById(deleteQuestion.q_id);

  }




  /**
  * create Question super Admin
  * @param questions 
  */

  @post('/questions/checkField', {
    responses: {
      '200': {
        description: 'Questions model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Questions } } },
      },
    },
  })
  async checkField(@requestBody() Field: Field): Promise<any> {
    Field.field_type_id = Field.field_type_id + "A"
    // check user role
    var getField = await this.fieldRepository.find({ order: ['field_id DESC'], where: { "field_type_id": Field.field_type_id } });
    return getField
  }



  /**
  * create Question super Admin
  * @param questions 
  */

  @post('/questions/checkField2', {
    responses: {
      '200': {
        description: 'Questions model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Questions } } },
      },
    },
  })
  async checkFieldAll(@requestBody() Field: Field): Promise<any> {
    Field.field_type_id = Field.field_type_id + "A"
    let skipValue = (Field.pageNo - 1) * Field.perPage;
    let limitValue = Field.perPage

    /**
  * count all data
  */
    var obj = { field_type_id: Field.field_type_id }
    var count = await this.fieldRepository.count(obj);

    // check user role
    var data = await this.fieldRepository.find({
      order: ['field_id DESC'], where: { "field_type_id": Field.field_type_id },
      "limit": limitValue, "skip": skipValue
    });
    return {
      "data": data,
      "paginationLength": count
    };
  }
}
