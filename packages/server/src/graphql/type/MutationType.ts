import { GraphQLObjectType } from 'graphql';

import EventMutations from '../../modules/event/mutations';
import TodoMutations from '../../modules/todo/mutations';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Event
    ...EventMutations,
    // Todo
    ...TodoMutations,
  }),
});
