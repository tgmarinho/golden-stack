import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import Todo from '../TodoModel';

import * as TodoLoader from '../TodoLoader';
import { TodoConnection } from '../TodoType';

interface TodoAddArgs {
  title: string;
  description: string;
  address: string;
  date: string;
}

const mutation = mutationWithClientMutationId({
  name: 'TodoAdd',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLNonNull(GraphQLString),
    },
    address: {
      type: GraphQLString,
    },
    date: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args: TodoAddArgs) => {
    const { title, description, address, date } = args;

    const newTodo = await new Todo({
      title,
      description,
      address,
      date,
    }).save();

    return {
      id: newTodo._id,
      error: null,
    };
  },
  outputFields: {
    TodoEdge: {
      type: TodoConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        const newTodo = await TodoLoader.load(context, id);

        // Returns null if no node was loaded
        if (!newTodo) {
          return null;
        }

        return {
          cursor: toGlobalId('Todo', newTodo._id),
          node: newTodo,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default {
  ...mutation,
};
