import sha1 from 'sha1';

export const fileToBase64 = function fileToBase64(file: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error: any) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const dlFile = function dlFile(url: string, filename?: string) {
  const DownloadLink: any = document.createElement('a');
  DownloadLink.style = 'display: none'; // 创建一个隐藏的a标签
  DownloadLink.download = filename || '';
  DownloadLink.href = url;
  document.body.appendChild(DownloadLink);
  DownloadLink.click(); // 触发a标签的click事件
  document.body.removeChild(DownloadLink);
};

export const dlTextFile = function dlTextFile(
  content: string,
  filename: string,
  type: string
) {
  const linkEl: any = document.createElement('a');
  linkEl.style = 'display: none'; // 创建一个隐藏的a标签
  linkEl.download = filename || '未命名.txt';
  linkEl.href = window.URL.createObjectURL(
    new Blob([content || ''], { type: type || 'text/plain' })
  );
  document.body.appendChild(linkEl);
  linkEl.click(); // 触发a标签的click事件
  document.body.removeChild(linkEl);
};

const readBlobJson = async (data: Blob) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(JSON.parse(reader.result as string));
    };

    reader.onerror = () => {
      reject(new Error('解析出错'));
    };

    reader.readAsText(data);
  });
};
export const getfilehash = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const data: ArrayBuffer = ev.target?.result as ArrayBuffer; // 获取读取的数据
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);           // hash the message
      const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
      resolve(hashHex);
    };
    reader.onerror = (error: any) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const saveFile = async (
  res: any
): Promise<{ success: boolean; msg: string }> => {
  const contentType = res.headers['content-type'];
  const result = {
    success: false,
    msg: '',
  };
  if (contentType === 'application/json') {
    const data: any = await readBlobJson(res.data);
    if (data?.errCode !== 0) {
      result.success = false;
      result.msg = data?.errMsg || '下载失败';
    }
  } else {
    const disposition = res.headers['content-disposition'];
    const fileName = decodeURI(
      disposition.substring(
        disposition.indexOf('filename=') + 9,
        disposition.length
      )
    );
    const blob = new Blob([res.data], { type: 'application/octet-stream' });
    const fileUrl = window.URL.createObjectURL(blob);
    dlFile(fileUrl, fileName);
    window.URL.revokeObjectURL(fileUrl);
    result.success = true;
    result.msg = res.data?.errMsg || '下载成功';
  }
  return result;
};

export function dataURLtoFile(dataurl: string, filename: string) {
  // 获取到base64编码
  const arr = dataurl.split(',');
  // 将base64编码转为字符串
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: arr[0].split(';')[0],
  });
}
export function formatBytes(bytes:number, decimals?:number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals? + 1 : 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}