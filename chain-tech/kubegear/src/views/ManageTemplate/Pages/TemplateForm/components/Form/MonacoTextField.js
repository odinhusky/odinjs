import React, { useCallback } from 'react';

// ! Fabric UI
import {
  Label,
  getTheme,
  DelayedRender,
  AnimationClassNames,
  FontSizes
} from 'office-ui-fabric-react';

// ? Self-packed Components || Functions
import { theme } from 'theme';
import MonacoEditor from 'components/monaco/monaco-editor';

// ^ Plugin
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';

/**
 * @author odin
 * @level views/ManageTemplate/TemplateForm/TaskRole/Content/MonacoTextFiled
 * @component MonacoTextFiled
 * @description MonacoTextFiled component
*/
export const MonacoTextFiled = props => {

  // $ init data
  const {
    value,
    onChange,
    label,
    placeholder,
    completionItems,
    monacoProps: rawMonacoProps,
    monacoRef,
    errorMessage
  } = props;

  const monacoProps = { ...rawMonacoProps };
  const rawEditorDidMount = monacoProps.editorDidMount;
  delete monacoProps.editorDidMount;


  // ! Fabric UI
  const { spacing, semanticColors } = getTheme();
  const borderColor = isEmpty(errorMessage)
    ? theme.others.monacoColor
    : semanticColors.errorText;

  // - methods
  const editorDidMountCallback = useCallback(
    (editor, monaco) => {
      editor.onDidFocusEditorText(() => {
        const value = editor.getValue();
        if (value === placeholder) {
          editor.setValue('');
        }
      });
      editor.onDidBlurEditorText(() => {
        const value = editor.getValue();
        if (isEmpty(value) && !isEmpty(placeholder)) {
          editor.setValue(placeholder);
        }
      });

      const value = editor.getValue();
      if (isEmpty(value) && !isEmpty(placeholder)) {
        editor.setValue(placeholder);
      }
      if (!isNil(rawEditorDidMount)) {
        rawEditorDidMount(editor, monaco);
      }
    },
    [rawEditorDidMount],
  );

  return (
    <div>
      {!isNil(label) && <Label>{label}</Label>}
      <MonacoEditor
        completionItems={completionItems}
        monacoProps={{
          theme: 'vs',
          language: 'plaintext',
          options: {
            automaticLayout: true,
            wordWrap: 'on',
            readOnly: false,
            defaultEOL: 1,
            minimap: { enabled: false }
          },
          value: value,
          onChange: onChange,
          editorDidMount: editorDidMountCallback,
          ...monacoProps
        }}
        monacoRef={monacoRef}
        style={{
          flex: '1 1 100%',
          minHeight: 0,
          border: 'solid 1px',
          borderColor: borderColor,
          paddingTop: spacing.s1
        }}
      />
      {!isEmpty(errorMessage) && (
        <div role="alert">
          <DelayedRender>
            <p
              className={AnimationClassNames.slideDownIn20}
              style={{
                fontSize: FontSizes.small,
                color: semanticColors.errorText,
                margin: 0,
                paddingTop: spacing.s2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span data-automation-id="error-message">
                {errorMessage}
              </span>
            </p>
          </DelayedRender>
        </div>
      )}
    </div>
  );
};

MonacoTextFiled.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  completionItems: PropTypes.array,
  monacoProps: PropTypes.object,
  monacoRef: PropTypes.object,
  errorMessage: PropTypes.string
};

export default MonacoTextFiled;
