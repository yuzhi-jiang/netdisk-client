<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useVisible from '@/hooks/visible';

  defineEmits(['success']);

  const { visible, setVisible } = useVisible();

  const init = async () => {
    setVisible(true);
  };

  defineExpose({ init });
</script>

<template>
  <a-modal
    v-model:visible="visible"
    title="上传"
    :footer="false"
    :unmount-on-close="true"
    title-align="start"
  >
    <a-upload draggable></a-upload>
  </a-modal>
</template>
