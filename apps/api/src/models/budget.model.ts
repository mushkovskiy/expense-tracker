import { type Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { Category } from './category.model';
import { User } from './user.model';

@index({ user: 1 })
export class Budget {
  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ ref: () => Category })
  public category?: Ref<Category>;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public currency!: string;

  @prop({ required: true, enum: ['weekly', 'monthly', 'yearly'] })
  public period!: 'weekly' | 'monthly' | 'yearly';

  @prop({ required: true })
  public startDate!: Date;
}

export const BudgetModel = getModelForClass(Budget, {
  schemaOptions: { timestamps: true },
});
