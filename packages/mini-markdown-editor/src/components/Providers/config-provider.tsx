/**
 * @创建上下文组件
 */
import { createContext, type FC } from "react";
import { defaultGlobalConfig } from "@/config/global";
import type { GlobalConfig } from "@/types/global-config";

export const ConfigContext = createContext(defaultGlobalConfig);

export const ConfigProvider: FC<{
  children: React.ReactNode;
  config?: GlobalConfig;
}> = ({ children, config }) => {
  return (
    <ConfigContext.Provider value={{ ...defaultGlobalConfig, ...config }}>
      {children}
    </ConfigContext.Provider>
  );
};
