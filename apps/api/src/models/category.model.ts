import { type Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { User } from './user.model';

@index({ user: 1 })
export class Category {
  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ required: true })
  public color!: string;

  @prop()
  public icon?: string;
}

export const CategoryModel = getModelForClass(Category, {
  schemaOptions: { timestamps: true },
});
