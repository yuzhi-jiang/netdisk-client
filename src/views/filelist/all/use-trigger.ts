import { ref } from 'vue';

export default function useTrigger() {
  const triggers = ref<{ key: string; icon: string; label: string }[]>([
    {
      key: 'create.dir',
      icon: 'icon-xinjianwenjianjia',
      label: 'filelist.trigger.create.dir',
    },
    {
      key: 'upload.file',
      icon: 'icon-shangchuanwenjian-01',
      label: 'filelist.trigger.upload.file',
    },
    {
      key: 'upload.dir',
      icon: 'icon-shangchuanwenjianjia-01',
      label: 'filelist.trigger.upload.dir',
    },
  ]);

  return {
    triggers,
  };
}
