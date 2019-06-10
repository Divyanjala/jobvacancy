import {Count,CountSchema,Filter,repository,Where} from '@loopback/repository';
import {post, param, get, getFilterSchemaFor, getWhereSchemaFor, patch, put, del, requestBody,} from '@loopback/rest';
import {Test} from '../models';
import {TestRepository} from '../repositories';


//fore get all exam
class getTest{
  a_job_id: string
}

export class TestController {

  constructor(
    @repository(TestRepository)
    public testRepository : TestRepository,
  ) {}


  @post('/test/new', {
    responses: {
      '200': {
        description: 'Test model instance',
        content: {'application/json': {schema: {'x-ts-type': Test}}},
      },
    },
  })
  async create(@requestBody() test: Test): Promise<Test> {
    test.a_job_id=test.a_job_id+"A"
    return await this.testRepository.create(test);
  }


 

  @post('/tests/all', {
    responses: {
      '200': {
        description: 'Array of Test model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Test}},
          },
        },
      },
    },
  })
  async find(
    @requestBody() getTest: getTest
  ): Promise<any> {
    getTest.a_job_id=getTest.a_job_id+"A"
    return await this.testRepository.find({ "where": { "a_job_id": getTest.a_job_id } });
  }


  @patch('/tests', {
    responses: {
      '200': {
        description: 'Test PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() test: Test,
    @param.query.object('where', getWhereSchemaFor(Test)) where?: Where,
  ): Promise<Count> {
    return await this.testRepository.updateAll(test, where);
  }

  @get('/tests/{id}', {
    responses: {
      '200': {
        description: 'Test model instance',
        content: {'application/json': {schema: {'x-ts-type': Test}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Test> {
    return await this.testRepository.findById(id);
  }

  @patch('/tests/{id}', {
    responses: {
      '204': {
        description: 'Test PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() test: Test,
  ): Promise<void> {
    await this.testRepository.updateById(id, test);
  }

  @put('/tests/{id}', {
    responses: {
      '204': {
        description: 'Test PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() test: Test,
  ): Promise<void> {
    await this.testRepository.replaceById(id, test);
  }

  @del('/tests/{id}', {
    responses: {
      '204': {
        description: 'Test DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.testRepository.deleteById(id);
  }
}
