/**
 * @侧边栏导出模块
 * @exportHTML与exportPdf导出函数
 */

import { useState, type FC } from "react";
import styled from "styled-components";
import { Button, Form, Input, Select } from "antd";
import { useEditorContentStore } from "@/store/editor";
import FormItem from "antd/es/form/FormItem";
import { exportPdf } from "@/utils/output-pdf";
import { exportHtml } from "@/utils/output-html";
import { CLASS_PREFIX } from "@/common";
const Wrapper = styled.div/*css*/ `
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
`;
interface FiledType {
  fileType: "PDF" | "HTML";
  fileName: string;
}
const Output: FC = () => {
  const [form] = Form.useForm<FiledType>();
  const preview = useEditorContentStore((state) => state.previewView);
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    const { fileName, fileType } = form.getFieldsValue();
    setLoading(true);
    switch (fileType) {
      case "PDF":
        {
          await exportPdf(preview!, fileName);
        }
        break;
      case "HTML": {
        await exportHtml(preview!, fileName);
        break;
      }
      default:
        break;
    }
    setLoading(false);
  };
  return (
    <Wrapper className={`${CLASS_PREFIX}-sidebar-output`}>
      <Form initialValues={{ fileType: "PDF", fileName: "markdown" }}>
        <FormItem label="导出文件类型" name="fileType">
          <Select
            options={[
              { value: "PDF", label: "PDF" },
              { value: "HTML", label: "HTML" },
            ]}
            placeholder="请选择导出文件类型"
          />
        </FormItem>
        <FormItem label="导出文件名" name="fileName">
          <Input placeholder="请填写文件名" />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            loading={loading}
            style={{ width: "100%" }}
            onClick={handleExport}
          >
            导出
          </Button>
        </FormItem>
      </Form>
    </Wrapper>
  );
};
export default Output;
