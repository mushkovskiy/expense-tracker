import type { IUser } from '@repo/types';
import type { DocumentType } from '@typegoose/typegoose';
import type { User } from '../../models/user.model';

export function toIUser(doc: DocumentType<User>): IUser {
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    createdAt: new Date(doc.createdAt ?? 0).toISOString(),
    updatedAt: new Date(doc.updatedAt ?? 0).toISOString(),
  };
}
