import { type Ref, getModelForClass, index, prop } from '@typegoose/typegoose';

@index({ email: 1 }, { unique: true })
export class User {
  @prop({ required: true, unique: true, lowercase: true, trim: true })
  public email!: string;

  @prop({ required: true })
  public passwordHash!: string;

  @prop({ required: true, trim: true })
  public name!: string;
}

export type UserRef = Ref<User>;

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
