<template>
  <a-layout-footer class="footer">© {{ settings.copyright }}</a-layout-footer>
</template>

<script lang="ts" setup>
  import * as settings from '@/config/settings.json';
  // extension: provide an api to get dynamic copyright.
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
