import React from "react"
import CodeMirror, { StateField } from "@uiw/react-codemirror"
import { Prec } from "@codemirror/state";
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, Panel, showPanel } from "@codemirror/view"
import { keymap, lineNumbers, highlightActiveLineGutter } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { autocompletion } from "@codemirror/autocomplete"
import { appTheme } from "./theme";


function createHelpPanel(): Panel {
    const dom = document.createElement("div")
    dom.className = "cm-help-panel"
    dom.innerHTML = `\
💡 Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to execute, \
use <code>{{ embed("string") }}</code> to \
<a href="https://github.com/pgvector/pgvector?tab=readme-ov-file#querying">extract an embedding</a>`

    return {
        top: false,
        dom
    }
}

const helpPanelState = StateField.define<boolean>({
    create: () => true,
    update(value) {
        return value
    },
    provide: (f) => showPanel.from(f, (on) => (on ? createHelpPanel : null)),
})

const executionKeymap = (onExecute?: () => void) =>
    Prec.highest(keymap.of([
        {
            key: "Mod-Enter",
            run: () => {
                onExecute?.()
                return !!onExecute
            },
            preventDefault: true,
        },
    ]))

export type SqlEditorProps = {
    value: string
    onChange: (value: string) => void
    onExecute?: () => void
    dark?: boolean
    readOnly?: boolean
    placeholder?: string
    height?: string
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
    value,
    onChange,
    dark = true,
    onExecute,
    readOnly = false,
    placeholder = "< Write PostgreSQL queries here >",
    height = "300px"
}) => {
    return (
        <CodeMirror
            value={value}
            onChange={(value) => onChange(value)}
            height={height}
            theme={dark ? oneDark : "light"}
            readOnly={readOnly}
            placeholder={placeholder}
            basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
                highlightActiveLineGutter: true,
                autocompletion: true,
                lintKeymap: true
            }}
            extensions={[
                executionKeymap(onExecute),
                sql(),
                history(),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                EditorView.lineWrapping,
                lineNumbers(),
                highlightActiveLineGutter(),
                autocompletion(),
                helpPanelState,
                appTheme
            ]}
        />
    )
}
