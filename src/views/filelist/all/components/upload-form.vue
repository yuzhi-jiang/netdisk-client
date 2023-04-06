<script lang="ts" setup>
import { useRoute } from 'vue-router';
import useLoading from '@/hooks/loading';
import useVisible from '@/hooks/visible';
import { Message, RequestOption, UploadRequest } from '@arco-design/web-vue';
import { has } from 'lodash';
import {
  createWithFolders,
  uploadPart,
  complete,
  XHR_UPLOAD_URL,
} from '@/api/fileupload';
import { FileParams, uploadPartParams } from '@/api/fileupload';
import { getfilehash } from '@/utils/file';

defineEmits(['success']);
const route = useRoute();
const { visible, setVisible } = useVisible();
const defFromdata: FileParams = {
  checkNameMode: 'auto_rename',
  parentFileId: '',
  diskId: '',
  fileName: '',
  type: 'file',
  hash: '',
};
const defUploadPart: uploadPartParams = {
  file: undefined,
  token: undefined,
  uploadId: undefined,
};

const xhrRequest = async (xhr: XMLHttpRequest, option: RequestOption) => {
  const { onError, onSuccess, onProgress, fileItem, name } = option;

  if (xhr.upload) {
    xhr.upload.onprogress = (event) => {
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

  xhr.onerror = (e) => {
    onError(e);
  };

  xhr.onload = async () => {
    if (xhr.status < 200 || xhr.status >= 300) {
      onError(xhr.responseText);
      return;
    }
    /**
     * 第三步 确认
     */
    Message.success('上传成功');

    const {
      data: { fileId },
    } = JSON.parse(xhr.response);
    debugger
    try {
      const { code, msg }: any = await complete({
        fileId,
        uploadId,
        diskId: defFromdata.diskId,
      });
      if (code === 501) {
        Message.error(msg);
        return;
      }
      onSuccess(xhr.response);
    } catch (error) {
      Message.error('第三步错误');
    }
  };

  console.log(defFromdata)
  defFromdata.fileName = name as string;
  debugger
  /**
   * 计算文件 SHA1 值
   */
  const hash = await getfilehash(fileItem.file);
  console.log(hash);

  defFromdata.hash = hash;
  defFromdata.fileName = name as string;

  /**
   * 第一步，判断是否可以快速上传
   */

  let step1Res: any;
  try {
    const res = await createWithFolders(defFromdata);
    step1Res = res.data;
  } catch (error) {
    Message.error('第一步出错');
    return;
  }

  if (step1Res.rapidUpload == true) {
    // 快速上传
    try {
      xhr.abort();
      Message.success('上传成功');
    } catch (error) {
      Message.error('上传错误');
    }
    return;
  }

  /**
   * 第二步：上传文件
   */
  const { token, uploadId } = step1Res;
  let fileId: string;
  try {
    const formData = new FormData();
    formData.append('file', fileItem.file as File);
    formData.append('token', token);
    formData.append('uploadId', uploadId);
    xhr.open('put', XHR_UPLOAD_URL, true);
    xhr.send(formData);
  } catch (error) {
    Message.error('第二步骤出错');
    return;
  }
};

const customRequest = (option: RequestOption): UploadRequest => {
  const xhr = new XMLHttpRequest();

  // formData.append(name || 'file', fileItem.file);
  // if (typeof name === 'string' && fileItem.file) {

  // } else if (typeof name === 'function' && fileItem.file) {
  //   formData.append(name(fileItem), fileItem.file);
  // }

  xhrRequest(xhr, option);

  const abort = () => {
    xhr.abort();
  };

  return {
    abort,
  };
};

const init = async (diskId: string, parentFileId: string) => {
  defFromdata.diskId = diskId;
  defFromdata.parentFileId = parentFileId;
  setVisible(true);
};

defineExpose({ init });
</script>

<template>
  <a-modal v-model:visible="visible" title="上传" :footer="false" :unmount-on-close="true" title-align="start">
    <a-upload :custom-request="customRequest" draggable></a-upload>
  </a-modal>
</template>
