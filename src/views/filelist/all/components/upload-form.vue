<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useVisible from '@/hooks/visible';
  import { Message, RequestOption, UploadRequest } from '@arco-design/web-vue';

  defineEmits(['success']);

  const { visible, setVisible } = useVisible();

  const xhrRequest = async (xhr: XMLHttpRequest, formData: FormData) => {
    xhr.open('post', '//upload-z2.qbox.me/', true);

    /**
     * 第一步 hash
     */

    /**
     * 第二步 上传
     */
    // await getids() {}
    // xhr.send(formData);

    try {
      xhr.abort();
    } catch (error) {
      Message.error('上传错误');
    }

    /**
     * 第三步 确认
     */
    Message.success('上传成功');
  };

  const customRequest = (option: RequestOption): UploadRequest => {
    const { onProgress, onError, onSuccess, fileItem, name } = option;

    const xhr = new XMLHttpRequest();
    if (xhr.upload) {
      xhr.upload.onprogress = function (event) {
        let percent = 0;
        if (event.total > 0) {
          /**
           * 百分比
           */
          percent = event.loaded / event.total;
        }
        onProgress(percent, event);
      };
    }
    xhr.onerror = function error(e) {
      onError(e);
    };
    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        onError(xhr.responseText);
        return;
      }
      onSuccess(xhr.response);
    };
    const formData = new FormData();

    if (typeof name === 'string' && fileItem.file) {
      formData.append(name || 'file', fileItem.file);
    } else if (typeof name === 'function' && fileItem.file) {
      formData.append(name(fileItem), fileItem.file);
    }

    xhrRequest(xhr, formData);

    const abort = () => {
      xhr.abort();
    };

    return {
      abort,
    };
  };

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
    <a-upload :custom-request="customRequest" draggable></a-upload>
  </a-modal>
</template>
