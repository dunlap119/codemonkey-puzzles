let cmInstance = null;

export function initEditor(textareaEl) {
  cmInstance = CodeMirror.fromTextArea(textareaEl, {
    mode: 'coffeescript',
    theme: 'monokai',
    lineNumbers: false,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    extraKeys: {
      Tab: (cm) => cm.execCommand('indentMore'),
      'Shift-Tab': (cm) => cm.execCommand('indentLess'),
    },
  });
  cmInstance.setSize('100%', '100%');
  return cmInstance;
}

export function getCode() {
  return cmInstance ? cmInstance.getValue() : '';
}

export function setCode(code) {
  if (cmInstance) {
    cmInstance.setValue(code);
    cmInstance.clearHistory();
  }
}

export function highlightError(line) {
  if (!cmInstance || line == null) return;
  cmInstance.addLineClass(line, 'background', 'cm-error-line');
}

export function clearErrors() {
  if (!cmInstance) return;
  for (let i = 0; i < cmInstance.lineCount(); i++) {
    cmInstance.removeLineClass(i, 'background', 'cm-error-line');
  }
}

export function focus() {
  if (cmInstance) cmInstance.focus();
}
