import { queryOptions } from '@tanstack/react-query';
import { getUserById } from 'src/api/firebase';

export const userInfoQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['userInfo', userId],
    queryFn: () => getUserById(userId),
  });
