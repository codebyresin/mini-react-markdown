import SaveIcon from "@/assets/images/save.svg?raw";
import IconToolTip from "../Base/IconToolTip";
import { useEditorContentStore } from "@/store/editor";
import { useSaveContent } from "@/hooks/use-save-content";
import { useGlobalConfig } from "@/hooks/use-global-config";
import { t, type TRANSLATION_KEYS } from "@/locales";
import { TOOLBAR_KEYS } from "@/locales/keys";
import { Hotkey } from "@/common/hotkey";
import type { EditorView } from "@uiw/react-codemirror";

const Save = () => {
  const { content, editorView } = useEditorContentStore();
  const saveContent = useSaveContent();
  const { onSave } = useGlobalConfig();
  const handleSave = () => {
    if (content) {
      saveContent(content);
      if (onSave) {
        onSave(content, editorView as EditorView);
      }
    }
  };
  return (
    <IconToolTip
      content={t(TOOLBAR_KEYS.TOOLBAR.save as TRANSLATION_KEYS)}
      description={Hotkey.SAVE.readableCommand}
      onClick={handleSave}
    >
      <div
        className="icon"
        dangerouslySetInnerHTML={{ __html: SaveIcon }}
      ></div>
    </IconToolTip>
  );
};
export default Save;
