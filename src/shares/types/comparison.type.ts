export type TComparisonItem = {
  databaseDataId: string;
  comment: string;
};

export type TComparison = {
  id: string;
  name: string;
  description: string;
  items: TComparisonItem[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
