import { Count, CountSchema, Filter, repository, Where, } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getWhereSchemaFor, patch, put, del, requestBody, HttpErrors, } from '@loopback/rest';
import { Field } from '../models';
import { FieldRepository } from '../repositories';
import { QuestionsRepository } from '../repositories';
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';//set authentication
import { inject } from '@loopback/core';


//for delete field
class deleteField {
  field_id: string
}


export class FieldController {
  constructor(
    @repository(FieldRepository) public fieldRepository: FieldRepository,
    @repository(QuestionsRepository) public questionsRepository: QuestionsRepository,
    @inject(AuthenticationBindings.CURRENT_USER, { optional: true }) private user: UserProfile,

  ) { }

  //new fields Added
  @authenticate('BearerStrategy')
  @post('/fields/new', {
    responses: {
      '200': {
        description: 'Field model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Field } } },
      },
    },
  })
  async create(@requestBody() field: Field): Promise<any> {
    //convert string to lowercase 
    var type = field.field_name;
    var type_lowercase = type.toLowerCase();

    //filed type id
    field.field_type_id=field.field_type_id + "A"
    
    //check duplicate field_name_lowercase
    let companyCheckType = await this.fieldRepository.find({ "where": { "field_type_id": field.field_type_id } });

      //get object value
      var field_name;
      var field_id;
      companyCheckType.filter(obj => {
        
        if (obj.field_name==type_lowercase) {
          field_name= obj.field_name
        }
        field_id=obj.field_type_id
      })

      if (field.field_type_id==field_id) {//check field type
        if (field_name===type_lowercase) {//check field name
          throw new HttpErrors.NotFound('Industrial name is already exist ');
        }
      }


    field.field_status = 'active';
    

    return await this.fieldRepository.create(field);
  }


  //fields update
  @authenticate('BearerStrategy')
  @put('/fields/update', {
    responses: {
      '200': {
        description: 'Company PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() field: Field,
    @param.query.object('where', getWhereSchemaFor(Field)) where?: Where,
  ): Promise<any> {
    var update = await this.fieldRepository.updateAll(field, where);
    if (update) {
      return { data: "Industrial name update success" };
    } else {
      throw new HttpErrors.NotFound('Industrial name update was not success');
    }
  }


  @get('/fields/count', {
    responses: {
      '200': {
        description: 'Field model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Field)) where?: Where,
  ): Promise<Count> {
    return await this.fieldRepository.count(where);
  }

  @get('/fields', {
    responses: {
      '200': {
        description: 'Array of Field model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Field } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Field)) filter?: Filter,
  ): Promise<Field[]> {
    return await this.fieldRepository.find(filter);
  }




  @patch('/fields/{id}', {
    responses: {
      '204': {
        description: 'Field PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() field: Field,
  ): Promise<void> {
    await this.fieldRepository.updateById(id, field);
  }

  @put('/fields/{id}', {
    responses: {
      '204': {
        description: 'Field PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() field: Field,
  ): Promise<void> {
    await this.fieldRepository.replaceById(id, field);
  }




  /**
   * field delete
   * @param id 
   */
  @authenticate('BearerStrategy')
  @post('/fields/delete', {
    responses: {
      '204': {
        description: 'Field DELETE success',
      },
    },
  })
  async deleteById(@requestBody() deleteField: deleteField): Promise<any> {
    

    var filed_id_concat = deleteField.field_id + "A";
    var checkField = await this.questionsRepository.find({ "where": { "field_id": filed_id_concat } });//check field

    //get object value
    var fields_id_new;
    checkField.filter(obj => {
      fields_id_new = obj.field_id
    })

    //before delete check relation field_id in child class
    if (fields_id_new==filed_id_concat) {
      throw new HttpErrors.NotFound("This industrial name used for the question");
    }else{
      await this.fieldRepository.deleteById(deleteField.field_id);//delete query
      
    }
  }
}

