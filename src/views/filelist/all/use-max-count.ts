import { ref, computed } from 'vue';
import { BreadcrumbRoute } from '@arco-design/web-vue';

export default function useMaxCount() {
  const routes = ref<BreadcrumbRoute[]>();
  const maxCount = computed(() => {
    const breadWidth = (window.innerWidth / 3) * 2; // convenience, breadcrumb
    const targets = routes.value?.reduce(
      (prev, route) => {
        const [length, counter] = prev;
        const { label } = route;
        if (length >= counter) {
          return [length, counter];
        }
        // font-size = 13x
        return [length + label.length * 13, counter + 1];
      },
      [0, 0]
    );

    if (targets) {
      const [length, counter] = targets;
      return length >= breadWidth ? counter : 0;
    }
    return 0; // unlimited
  });

  const setRoutes = (ros: BreadcrumbRoute[]) => {
    routes.value = ros;
  };

  return { routes, maxCount, setRoutes };
}
