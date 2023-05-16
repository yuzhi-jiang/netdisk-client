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
import { formatBytes, getFileHash } from '@/utils/file';
import axios, { AxiosRequestConfig } from 'axios';
const emits = defineEmits(['success']);

const route = useRoute();
const { visible, setVisible } = useVisible();
let source: any; // to store the cancel token source
let paused: boolean = false; // to check if file upload is paused
let hasUploadParams: boolean = false; // to check if file upload is paused
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
const config = (option: RequestOption): AxiosRequestConfig => {
  const { onProgress, onError, onSuccess, fileItem, name } = option;
  let start = 0;
  start = Date.now();
  return {

    onUploadProgress: (event) => {

      let loaded = 0;
      let percent = 0;
      if (event.total > 0) {
        // 0 ~ 1
        percent = event.loaded / event.total;
        console.log(percent)
        loaded = event.loaded;
        const end = Date.now();
        const time = end - start;
        const sizeInBytes = loaded;
        const speedInBytesPerSecond = sizeInBytes / (time / 1000);

        console.log(`上传速度为 ${formatBytes(speedInBytesPerSecond)}/s`);
      }
      if (!paused) {
        onProgress(percent, event);
      } else {
        console.log('结束一')
        source.cancel('File upload paused');
      }
    },
    cancelToken: source.token
  }
}


const createWithFolders1 = async (params: FileParams, option: RequestOption) => {
  const { onProgress, onError, onSuccess, fileItem, name } = option;
  const { data } = await createWithFolders(defFromdata);

  if (data.rapidUpload === true) {
    setTimeout(() => onProgress(50), 500)
    setTimeout(() => onProgress(100), 1000)


    setTimeout(() => {
      successUpload(onSuccess)
      emits('success');
      setVisible(false);
    }, 1500)
    return;
  }
  const { token, uploadId } = data;
  if (!token || !uploadId) {
    onError("上传失败")
    return;
  }
  defUploadPart.token = token
  defUploadPart.file = fileItem.file
  defUploadPart.uploadId = uploadId
  hasUploadParams = true;
  uploadPart1(defUploadPart, option);
};

const uploadPart1 = async (defUploadPart: uploadPartParams, option: RequestOption) => {
  const { onError } = option;
  const uploadId = defUploadPart.uploadId as string
  // const res: any = await axios.put('http://127.0.0.1:8082/front/file/uploadPart', formData, config(option));
  uploadPart(defUploadPart, config(option)).then(res => {
    const { fileId } = res.data
    if (fileId) {
      complete1(fileId, uploadId, defFromdata.diskId, option)
    } else {
      onError("上传失败")
    }
  }).catch((error) => {
    if (axios.isCancel(error)) {
      console.log('File upload canceled:', error.message);
    } else {
      console.error('File upload failed:', error);
    }
    return
  });
}
const complete1 = async (fileId: string, uploadId: string, diskId: string, option: RequestOption) => {
  const { onProgress, onError, onSuccess, fileItem, name } = option;
  const { code, msg }: any = await complete({
    fileId,
    uploadId,
    diskId
  });

  if (code === 501) {
    Message.error(msg);
    return;
  }
  successUpload(onSuccess)
  emits('success');
  setVisible(false);
}

const successUpload = (callback: Function) => {
  hasUploadParams = false;
  callback()
  console.log('成功')
  return;
}

const resumeUpload = (option: RequestOption) => {
  source = axios.CancelToken.source();
  uploadPart1(defUploadPart, option)
}
const main = async (option: RequestOption) => {
  const { onProgress, onError, onSuccess, fileItem, name } = option;
  source = axios.CancelToken.source();


  /**
 * 计算文件 SHA1 值
 */
  const hash = await getFileHash(fileItem.file);
  console.log(hash);

  defFromdata.hash = hash;
  console.log(defFromdata)
  defFromdata.fileName = fileItem.name as string;

  createWithFolders1(defFromdata, option);
}

const UploadRequest = (option: RequestOption): UploadRequest => {
  const { onProgress, onError, onSuccess, fileItem, name } = option;

  console.log('开始上传')
  if (paused && hasUploadParams) {
    paused = false;
    resumeUpload(option);
  } else {
    main(option)
  }


  return {
    abort() {
      console.log("结束")
      paused = true;
      source.cancel('File upload aborted');
    }
  }
}

const init = async (diskId: string, parentFileId: string) => {
  defFromdata.diskId = diskId;
  if (parentFileId == '') {
    parentFileId = 'root';
  }
  defFromdata.parentFileId = parentFileId;
  setVisible(true);
};

defineExpose({ init });

</script>

<template>
  <AModal v-model:visible="visible" title="上传" :footer="false" :unmount-on-close="true" title-align="start">
    <AUpload :custom-request="UploadRequest" draggable></AUpload>
  </AModal>
</template>
