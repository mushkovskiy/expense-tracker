import { type Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { Category } from './category.model';
import { User } from './user.model';

@index({ user: 1, date: -1 })
export class Expense {
  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ ref: () => Category, required: true })
  public category!: Ref<Category>;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public currency!: string;

  @prop()
  public description?: string;

  @prop({ required: true })
  public date!: Date;
}

export const ExpenseModel = getModelForClass(Expense, {
  schemaOptions: { timestamps: true },
});
