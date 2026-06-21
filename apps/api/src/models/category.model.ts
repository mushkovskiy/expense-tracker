import { type Ref, getModelForClass, index, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user.model';

@index({ user: 1, name: 1 }, { unique: true })
export class Category extends TimeStamps {
  @prop({ ref: () => User, required: true })
  public user!: Ref<User>;

  @prop({ type: () => String, required: true, trim: true })
  public name!: string;

  @prop({ type: () => String, required: true })
  public color!: string;

  @prop({ type: () => String })
  public icon?: string;
}

export const CategoryModel = getModelForClass(Category, {
  schemaOptions: { timestamps: true },
});
