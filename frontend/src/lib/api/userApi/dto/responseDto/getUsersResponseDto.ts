import type { ServerUserModel } from '../../../../models';

export interface GetUsersResponseDto {
  items: ServerUserModel[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}
