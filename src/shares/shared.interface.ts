export interface IPagination {
  page: number;
  limit: number;
  sort?: {
    createdAt: 1 | -1;
  };
}

export enum ESort {
  DESC = 'DESC',
  ASC = 'ASC',
}
