<script lang="ts" setup>
  import { ActionButton } from '@/components/list/types';

  interface IProps {
    action: ActionButton;
    onAction: (data: any) => void;
    icon: string;
    iconSize?: number | string;
    name?: string;
  }
  const props = defineProps<IProps>();
</script>

<template>
  <a-button
    :type="action.type || 'primary'"
    :status="action.status || 'normal'"
    @click="onAction({ action, record: null })"
  >
    <template #icon>
      <IconFont :type="icon" :size="iconSize" />
    </template>
    {{ name ? $t(name) : $t(action.key) }}
  </a-button>
</template>
