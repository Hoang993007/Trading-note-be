// If using mongoose .lean(), it will replace the id with _id value.

import { PaginateResult } from 'mongoose';

// This function is used to convert the pagination data to object without using the .lean()
export const paginationToObject = (
  paginationData: PaginateResult<any>,
): PaginateResult<any> => {
  return {
    ...paginationData,
    docs: paginationData.docs.map((el: any) => el.toObject()),
  };
};
