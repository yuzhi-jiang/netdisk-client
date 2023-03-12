const previewInNewWindow = function (name: string, html: string) {
  try {
    const tmp = window.open('about:blank') as Window;
    if (tmp) {
      tmp.document.title = `邮件预览 - ${name}`;
      tmp.document.body.innerHTML = html;
      tmp.focus();
    }
  } catch (err) {
    // you can report use errorHandler or other
  }
};

export default previewInNewWindow;
