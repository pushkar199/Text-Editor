import 'draft-js/dist/Draft.css';
import { inlineStyleMap } from '../utils/helper';
import { useState, useCallback, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertFromRaw, getDefaultKeyBinding, convertToRaw } from 'draft-js';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const savedContent = localStorage.getItem("draftjs-content");
    if (savedContent) {
      try {
        const content = JSON.parse(savedContent);
        const validContent = convertFromRaw(content);
        setEditorState(EditorState.createWithContent(validContent));
      } catch (e) {
        console.error(e);
        localStorage.removeItem("draftjs-content");
      }
    }
  }, []);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem("draftjs-content",JSON.stringify(convertToRaw(contentState)));
  };

  const keyBindingFn = (event) => {
    const plainText = editorState.getCurrentContent().getPlainText();
    if (event.keyCode === 32) {
      if (plainText.endsWith("#")) {
        return "header-two";
      } else if (plainText.endsWith("*")) {
        const numAsterisks = plainText.match(/\*/g).length;
        if (numAsterisks === 1) {
          return "bold";
        } else if (numAsterisks === 3) {
          return "underline";
        } else if (numAsterisks === 2) {
          return "red-color";
        }
      }
    }
    return getDefaultKeyBinding(event);
  };

  const handleInlineStyle = useCallback((editorState, _command, character, style) => {
      const selectionState = editorState.getSelection();
      const currentBlock = editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey());
      const currentText = currentBlock.getText();
      if (!currentText.endsWith(character))  return "not-handled";
      const characterIndex = currentText.length - character.length;
      let newState = EditorState.push(editorState, editorState.getCurrentContent(), "remove-range");
      newState = EditorState.forceSelection(newState, selectionState.merge({
          anchorOffset: characterIndex,
          focusOffset: currentText.length,
        })
      );
      if (style === "header-two") {
        newState = RichUtils.toggleBlockType(newState, "header-two");
      } else {
        newState = RichUtils.toggleInlineStyle(newState, style);
      }
      setEditorState(newState);
      return "handled";
    },
    [setEditorState]
  );

  const handleKeyCommand = (command) => {
    if (command === "bold") {
      handleInlineStyle(editorState, "bold", "*", "BOLD");
    } else if (command === "header-two") {
      handleInlineStyle(editorState, "header-two", "#", "header-two");
    } else if (command === "underline") {
      handleInlineStyle(editorState, "underline", "***", "UNDERLINE");
    } else if (command === "red-color") {
      handleInlineStyle(editorState, "red-color", "**", "REDCOLOR");
    }
  };

  return (
    <div>
      <div className="head">
        <h3>Editor</h3>
        <div>
          <button className="save-btn" onClick={saveContent}>
            Save
          </button>
        </div>
      </div>
      <div className="container">
        <Editor
          editorState={editorState}
          onChange={(newState) => setEditorState(newState)}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          customStyleMap={inlineStyleMap}
        />
      </div>
    </div>
  );
};

export default MyEditor;
