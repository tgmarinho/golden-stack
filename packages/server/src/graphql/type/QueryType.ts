import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { connectionArgs, fromGlobalId, globalIdField } from 'graphql-relay';

import { NodeField, NodesField } from '../../interface/NodeInterface';

import { GraphQLContext } from '../../types';
import * as EventLoader from '../../modules/event/EventLoader';
import EventType, { EventConnection } from '../../modules/event/EventType';

import * as TodoLoader from '../../modules/todo/TodoLoader';
import TodoType, { TodoConnection } from '../../modules/todo/TodoType';

export default new GraphQLObjectType<any, GraphQLContext, any>({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    id: globalIdField('Query'),
    node: NodeField,
    nodes: NodesField,
    events: {
      type: GraphQLNonNull(EventConnection.connectionType),
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, context) => await EventLoader.loadEvents(context, args),
    },
    event: {
      type: EventType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, { id }, context) => await EventLoader.load(context, fromGlobalId(id).id),
    },
    todos: {
      type: GraphQLNonNull(TodoConnection.connectionType),
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, context) => await TodoLoader.loadTodos(context, args),
    },
    todo: {
      type: TodoType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, { id }, context) => await TodoLoader.load(context, fromGlobalId(id).id),
    },
  }),
});
