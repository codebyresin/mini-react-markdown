import html2pdf from "html2pdf.js";

export const exportPdf = async (element: HTMLElement, filename: string) => {
  try {
    await html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true, //图片跨域
          allowTaint: true, //污染画布
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: 2100,
          windowHeight: 2970,
          includeShadowDom: true,
        },
        jsPDF: {
          unit: "mm", // 单位（毫米）
          format: "a4", // 纸张格式
          orientation: "portrait", // 方向（纵向）
        },
      })
      .save();
  } catch (error) {
    console.log(error);
  }
};
