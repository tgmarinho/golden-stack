import mongoose from 'mongoose';

import Event from '../modules/event/EventModel';
import Todo from '../modules/todo/TodoModel';

mongoose.Promise = global.Promise;

export { Event, Todo };
