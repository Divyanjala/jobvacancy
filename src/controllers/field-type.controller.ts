import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository';
import { post, param, get, getFilterSchemaFor, getWhereSchemaFor, patch, put, HttpErrors, requestBody } from '@loopback/rest';
import { FieldType } from '../models';
import { FieldTypeRepository } from '../repositories';
import { FieldRepository } from '../repositories';
import { ResponseProvider } from '../providers/Responses ';

//for delete field_type
class deleteFieldType {
  field_type_id: string
}


//pagination all 
class Pagination{
  perPage:number;
  pageNo:number;
}

export class FieldTypeController {
  responseProvider: ResponseProvider;
  constructor(
    @repository(FieldTypeRepository) public fieldTypeRepository: FieldTypeRepository,
    @repository(FieldRepository) public fieldRepository: FieldRepository
  ) {
    this.responseProvider = new ResponseProvider();//create object response Provider
  }


  /**
   * Add new Field Type
   * @param fieldType 
   */
  @post('/field-types/new', {
    responses: {
      '200': {
        description: 'FieldType model instance',
        content: { 'application/json': { schema: { 'x-ts-type': FieldType } } },
      },
    },
  })
  async create(@requestBody() fieldType: FieldType): Promise<any> {

    //convert string to lowercase 
    var type = fieldType.field_type;
    var type_lowercase = type.toLowerCase();

    //check duplicate field_type_lowercase
    let checkType = await this.fieldTypeRepository.find({ "where": { "field_type": type_lowercase } });

    //get object value
    var field_type_new;
    checkType.filter(obj => {
      field_type_new = obj.field_type
    })

    if (field_type_new == type_lowercase) {
      throw new HttpErrors.NotFound('Industrial sector is already exist ');
    } else {
      fieldType.field_type = type_lowercase;

      var newFieldType = await this.fieldTypeRepository.create(fieldType);//Add crude

      if (newFieldType) {
        return this.responseProvider.callbackWithSuccessMessage(
          'New industrial sector is create'
        );

      } else {
        throw new HttpErrors.NotFound("Industrial sector not Add");
      }
    }


  }





  /**
   * get all field type
   * @param filter 
   */
  @get('/field-types/all', {
    responses: {
      '200': {
        description: 'Array of industrial sector model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': FieldType } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(FieldType)) filter?: Filter,
  ): Promise<FieldType[]> {
    return await this.fieldTypeRepository.find({ order: ['field_type_id DESC']});
  }


  /**
   * get all field type
   * @param filter 
   */
  @post('/field-types/all2', {
    responses: {
      '200': {
        description: 'Array of industrial sector model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': FieldType } },
          },
        },
      },
    },
  })
  async findAllField(@requestBody() pagination: Pagination,
    @param.query.object('filter', getFilterSchemaFor(FieldType)) filter?: Filter,
  ): Promise<any> {
    //check user role
    let skipValue = (pagination.pageNo - 1) * pagination.perPage;
    let limitValue = pagination.perPage

    
      /**
     * count all data
     */
    var count=await this.fieldTypeRepository.count();   
    let data=await this.fieldTypeRepository.find({ order: ['field_type_id DESC'] ,"limit":limitValue ,"skip":skipValue });
    
    
    return {
      "data":data,
      "paginationLength":count
    };
  }


  //field type update
  @put('/field-types/update', {
    responses: {
      '200': {
        description: 'Field type PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() fieldType: FieldType,
    @param.query.object('where', getWhereSchemaFor(FieldType)) where?: Where,
  ): Promise<any> {
   
    let obj = {
      field_type: fieldType.field_type,
      field_description: fieldType.field_description
    }
    //convert string to lowercase 
    var type = fieldType.field_type;
    var type_lowercase = type.toLowerCase();

    //check duplicate field_type_lowercase
    let checkType = await this.fieldTypeRepository.find({ "where": { "field_type": type_lowercase } });

    //get object value
    var field_type_new;
    checkType.filter(obj => {
      field_type_new = obj.field_type
    });
    
    if (field_type_new!=fieldType.field_type_id) {//check old field type for check duplicate field type
      if (field_type_new == type_lowercase) {//check duplicate field type
        throw new HttpErrors.NotFound('Industrial sector is already exist ');
      }
    }
   

    fieldType.field_type = type_lowercase;

    var update = await this.fieldTypeRepository.updateAll(obj, where);
    if (update) {
      return { data: "Industrial sector update success" };
    } else {
      throw new HttpErrors.NotFound('Industrial sector update was not success');
    }
  }



  /**
   * field delete
   * @param id 
   */
  @post('/fields-types/delete', {
    responses: {
      '204': {
        description: 'Field DELETE success',
      },
    },
  })
  async deleteById(@requestBody() deleteFieldType: deleteFieldType): Promise<any> {


    var filed_id_concat = deleteFieldType.field_type_id + "A";
    var checkField = await this.fieldRepository.find({ "where": { "field_type_id": filed_id_concat } });//check field

    //get object value
    var fields_id_new;
    checkField.filter(obj => {
      fields_id_new = obj.field_type_id
    })

    //before delete check relation field_id in child class
    if (fields_id_new == filed_id_concat) {
      throw new HttpErrors.NotFound("Industrial sector  used for Industrial name");
    } else {
      await this.fieldTypeRepository.deleteById(deleteFieldType.field_type_id);//delete query
    }
  }
}
