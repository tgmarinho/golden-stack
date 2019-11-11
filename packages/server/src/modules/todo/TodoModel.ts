import mongoose, { Document, Model, Types } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      description: 'Todo title',
      index: true,
      required: true,
    },
    description: {
      type: String,
      description: 'Todo description',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'Todo',
  },
);

Schema.index({ title: 'text', description: 'text' });

export interface ITodo extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TodoModel: Model<ITodo> = mongoose.model<ITodo, Model<ITodo>>('Todo', Schema);

export default TodoModel;
