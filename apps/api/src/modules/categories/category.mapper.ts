import type { ICategory } from '@repo/types';
import type { DocumentType } from '@typegoose/typegoose';
import type { Category } from '../../models/category.model';

export function toICategory(doc: DocumentType<Category>): ICategory {
  return {
    id: doc._id.toString(),
    userId: doc.user.toString(),
    name: doc.name,
    color: doc.color,
    icon: doc.icon,
    createdAt: new Date(doc.createdAt ?? 0).toISOString(),
    updatedAt: new Date(doc.updatedAt ?? 0).toISOString(),
  };
}
