import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../graphql/schema';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createTodo,
  disconnectMongoose,
  getContext,
  sanitizeTestObject,
} from '../../../../test/helpers';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

describe('TodoType queries', () => {
  it('should query an Todo', async () => {
    const todo = await createTodo();

    // language=GraphQL
    const query = `
      query Q($id: ID) {
        todo: node(id: $id) {
          id
          ... on Todo {
            id
            title
            description
          }
        }
      }
    `;

    const variables = {
      id: toGlobalId('Todo', todo._id),
    };
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should query all Todos', async () => {
    await createTodo();
    await createTodo();
    await createTodo();
    await createTodo();
    await createTodo();

    // language=GraphQL
    const query = `
      query Q {
        todos(first: 10) {
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `;

    const variables = {};
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });

  it('should search all Todos', async () => {
    await createTodo({ description: 'desc one' });
    await createTodo({ title: 'title one' });
    await createTodo({ description: 'three' });
    await createTodo({ description: 'two' });
    await createTodo({ title: 'title two' });

    // language=GraphQL
    const query = `
      query Q {
        todos(first: 10, search: "two") {
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `;

    const variables = {};
    const rootValue = {};
    const context = await getContext();
    const result = await graphql(schema, query, rootValue, context, variables);

    expect(result.errors).toBeUndefined();
    expect(sanitizeTestObject(result)).toMatchSnapshot();
  });
});
