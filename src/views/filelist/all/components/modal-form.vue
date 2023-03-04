<script setup lang="ts">
  import useVisible from '@/hooks/visible';

  const { visible, setVisible } = useVisible();

  const init = (data?: any) => {
    setVisible(true);
  };

  defineExpose({ init });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('filelist.create.form.title')"
    :footer="false"
    :unmount-on-close="true"
    title-align="start"
  >
    Form
  </a-modal>
</template>
