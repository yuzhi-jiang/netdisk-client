import axios, { AxiosResponse } from 'axios';

export type FileParams = {
    checkNameMode: 'auto_rename' | 'overwrite' | 'refuse';
    parentFileId: string;
    diskId: string;
    fileName: string;
    type: 'folder' | 'file';
    hash: string;
};

export type uploadPartParams = Partial<{
    file: File,
    token: string,
    uploadId: string
}>

export type completeParams = {
    fileId: string,
    diskId: string,
    uploadId: string
}
/**
 * 
 * 
  {
  "checkNameMode": "",
  "diskId": "",
  "fileName": "",
  "hash": "",
  "parentFileId": "",
  "type": ""
}
 */

export function createWithFolders(params: FileParams) {
    return axios.post('/front/file/createWithFolders', params);
}
export function uploadPart(params: uploadPartParams) {
    return axios.post('/front/file/uploadPart', params);
}
export function complete(params: completeParams) {
    return axios.post('/front/file/complete', params);
}
