export const exportHtml = (element: HTMLElement, filename: string) => {
  return new Promise((res, rej) => {
    try {
      // element是object
      const htmlContent = element.outerHTML; //string
      //获取样式字符串
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            console.error("Error accessing stylesheet:", e);
            return "";
          }
        })
        .join("\n");
      //形成html
      const fullHtmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Exported HTML</title>
            <style>
              ${styles}
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `;

      const blob = new Blob([fullHtmlContent], { type: "text/html" }); // 1. 创建 Blob
      const url = URL.createObjectURL(blob); // 2. 生成临时 URL
      const a = document.createElement("a"); // 3. 创建 <a> 标签
      a.href = url; // 4. 设置下载链接
      a.download = `${filename}.html`; // 5. 设置下载文件名
      document.body.appendChild(a); // 6. 挂载到 DOM
      a.click(); // 7. 触发点击下载
      document.body.removeChild(a); // 8. 移除 <a> 标签
      URL.revokeObjectURL(url); // 9. 释放内存

      res({ success: true, filename }); // 返回明确结果
    } catch (err) {
      rej(err);
    }
  });
};
