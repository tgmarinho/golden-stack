import { GraphQLNonNull, GraphQLObjectType, GraphQLObjectTypeConfig, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { connectionDefinitions } from '../../graphql/connection/CustomConnectionType';

import { NodeInterface } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';

import Todo from './TodoLoader';

type ConfigType = GraphQLObjectTypeConfig<Todo, GraphQLContext>;

const TodoTypeConfig: ConfigType = {
  name: 'Todo',
  description: 'Represents Todo',
  fields: () => ({
    id: globalIdField('Todo'),
    _id: {
      type: GraphQLNonNull(GraphQLString),
      description: 'MongoDB _id',
      resolve: todo => todo._id.toString(),
    },
    title: {
      type: GraphQLString,
      resolve: todo => todo.title,
    },
    description: {
      type: GraphQLString,
      resolve: todo => todo.description,
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => (createdAt ? createdAt.toISOString() : null),
    },
  }),
  interfaces: () => [NodeInterface],
};

const TodoType = new GraphQLObjectType(TodoTypeConfig);

export const TodoConnection = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLNonNull(TodoType),
});

export default TodoType;
