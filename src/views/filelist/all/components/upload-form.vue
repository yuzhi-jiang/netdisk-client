<script lang="ts" setup>
import { useRoute } from 'vue-router';
import useLoading from '@/hooks/loading';
import useVisible from '@/hooks/visible';
import { Message, RequestOption, UploadRequest } from '@arco-design/web-vue';
import { has } from 'lodash';
import { createWithFolders, uploadPart, complete } from '@/api/fileupload';
import { FileParams, uploadPartParams } from '@/api/fileupload';
import { getfilehash } from '../../../../utils/file'

defineEmits(['success']);
const defFromdata: FileParams = {
  checkNameMode: 'auto_rename',
  parentFileId: '',
  diskId: '',
  fileName: '',
  type: 'file',
  hash: ''
};
const defUploadPart: uploadPartParams = {
  file: undefined,
  token: undefined,
  uploadId: undefined
}
const route = useRoute();
const { visible, setVisible } = useVisible();
const createWithFolder = (data: FileParams) => {
  return createWithFolders(data)
}
const xhrRequest = async (xhr: XMLHttpRequest, formData: FormData) => {



  // 计算文件 SHA1 值
  const file = formData.get('file') as File;
  const hash = await getfilehash(file)
  console.log(hash)
  defFromdata.hash = hash
  defFromdata.fileName=file.name
  const res: any = await createWithFolder(defFromdata)
  if (res.rapidUpload == true) {
    //快速上传
    try {
      xhr.abort();
      
    } catch (error) {
      Message.error('上传错误');
    }
    return
  }




  xhr.open('post', '//upload-z2.qbox.me/', true);

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
  if (fileItem.file) {
    formData.append('file', fileItem.file);
  }
  // formData.append(name || 'file', fileItem.file);
  // if (typeof name === 'string' && fileItem.file) {

  // } else if (typeof name === 'function' && fileItem.file) {
  //   formData.append(name(fileItem), fileItem.file);
  // }

  xhrRequest(xhr, formData);

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
