import type { FC } from "react";
import { CLASS_PREFIX } from "@/common";
import { grammar, shortcuts } from "@/common/help";
import styled from "styled-components";
interface IRules {
  title: string;
  rules: Array<{
    title: string;
    icon: string;
    rule: string;
  }>;
}

const Wrapper = styled.div/*css*/ `
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .title {
    font-weight: 600;
    margin: 5px 0 16px;
    /* color: #3f4a54; */
    color: ${(props) => props.theme.silderHelpTitleColor};
  }
  .grammer-list {
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: content-box;
    padding-bottom: 5px;
    /* color: #959da5; */
    color: ${(props) => props.theme.silderHelpTextColor};
    .grammar-item {
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-bottom: 12px;
      .icon {
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 7.5px;
        /* fill: #959da5; */
        fill: ${(props) => props.theme.silderHelpTextColor};
      }
      .rule {
        margin-left: auto; //元素紧贴容器右侧
        code {
          font-size: 12px;
        }
      }
    }
  }
`;

//模板
const RenderRules: FC<IRules> = ({ title, rules }) => {
  return (
    <>
      <p className="title">{title}</p>
      <ul className="grammer-list">
        {rules.map((item, index) => {
          return (
            <div key={`grammer-${index}`} className="grammar-item">
              <div
                className="icon"
                dangerouslySetInnerHTML={{ __html: item.icon }}
              />
              <div>{item.title}</div>
              <div className="rule">
                <code>{item.rule}</code>
              </div>
            </div>
          );
        })}
      </ul>
    </>
  );
};

const Help: FC = () => {
  return (
    <Wrapper className={`${CLASS_PREFIX}-sidebar-help`}>
      <RenderRules title="Markdown 语法" rules={grammar} />
      <RenderRules title="快捷键" rules={shortcuts} />
    </Wrapper>
  );
};
export default Help;
