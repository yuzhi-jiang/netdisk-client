import type { RouteParamsRaw } from 'vue-router';
import router from './index';

export function getRouteQueries() {
  const { redirect, ...othersQuery } = router.currentRoute.value.query;
  return { redirect, othersQuery };
}

export function redirectHome() {
  const { othersQuery } = getRouteQueries();

  router.push({
    name: 'filelist',
    query: othersQuery,
  });
}

export function redirectHomeOrDefault() {
  const { redirect, othersQuery } = getRouteQueries();
  router.push({
    name: (redirect as string) || 'filelist',
    query: {
      ...othersQuery,
    },
  });
}

export default {
  redirectHome,
  redirectHomeOrDefault,
};
