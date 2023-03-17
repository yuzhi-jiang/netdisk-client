<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import qs from 'query-string';
  import axios from 'axios';
  import { onMounted } from 'vue';

  const router = useRouter();
  const route = router.currentRoute;
  console.log(window.location.href);

  onMounted(async () => {
    const {
      query: { code },
    } = qs.parseUrl(window.location.href);
    const res = await axios.post(
      'http://192.168.196.80:8082/front/oauth/github/callback',
      {
        code,
      }
    );
    console.log(res);
  });
</script>

<template>
  {{ route }}
</template>
