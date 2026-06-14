export interface ICategory {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
}
