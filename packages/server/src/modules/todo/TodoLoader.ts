import {
  connectionFromMongoCursor,
  mongooseLoader,
  // eslint-disable-next-line
} from '@entria/graphql-mongoose-loader';
import DataLoader from 'dataloader';
import { ConnectionArguments } from 'graphql-relay';
import { Types } from 'mongoose';

import { DataLoaderKey, GraphQLContext } from '../../types';

import { escapeRegex } from '../../common/utils';

import TodoModel, { ITodo } from './TodoModel';

export default class Todo {
  id: string;
  _id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ITodo) {
    this.id = data.id || data._id;
    this._id = data._id;
    this.title = data.title;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

const viewerCanSee = () => true;

// TODO: investigate why we need to cast ids as any on the next line
export const getLoader = () => new DataLoader<DataLoaderKey, ITodo>(ids => mongooseLoader(TodoModel, ids as any));

export const load = async (context: GraphQLContext, id: DataLoaderKey) => {
  if (!id) {
    return null;
  }

  try {
    const data = await context.dataloaders.TodoLoader.load(id);

    if (!data) {
      return null;
    }

    return viewerCanSee() ? new Todo(data) : null;
  } catch (err) {
    return null;
  }
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) =>
  dataloaders.TodoLoader.clear(id.toString());

export const primeCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId, data: ITodo) =>
  dataloaders.TodoLoader.prime(id.toString(), data);

export const clearAndPrimeCache = (context: GraphQLContext, id: Types.ObjectId, data: ITodo) =>
  clearCache(context, id) && primeCache(context, id, data);

interface LoadTodoArgs extends ConnectionArguments {
  search?: string;
}

export const loadTodos = async (context: GraphQLContext, args: LoadTodoArgs) => {
  const conditions: any = {};

  if (args.search) {
    const searchRegex = new RegExp(`${escapeRegex(args.search)}`, 'ig');
    conditions.$or = [{ title: { $regex: searchRegex } }, { description: { $regex: searchRegex } }];
  }

  return connectionFromMongoCursor({
    cursor: TodoModel.find(conditions).sort({ date: 1 }),
    context,
    args,
    loader: load,
  });
};
