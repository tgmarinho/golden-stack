import { Event, Todo } from '../../src/models';
import { IEvent } from '../../src/modules/event/EventModel';

import { ITodo } from '../../src/modules/todo/TodoModel';

export const createEvent = async (payload: Partial<IEvent> = {}) => {
  const n = (global.__COUNTERS__.event += 1);
  const { title, description } = payload;

  return new Event({
    ...payload,
    title: title || `Event #${n}`,
    description: description || `This is an awesome event #${n}`,
  }).save();
};

export const createTodo = async (payload: Partial<ITodo> = {}) => {
  const n = (global.__COUNTERS__.todo += 1);
  const { title, description } = payload;

  return new Todo({
    ...payload,
    title: title || `Todo #${n}`,
    description: description || `This is an awesome todo #${n}`,
  }).save();
};
