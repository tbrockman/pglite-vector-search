import { EditorView } from "@codemirror/view";

export const appTheme = EditorView.theme({
    "&": {
        borderRadius: 'var(--mantine-radius-md)'
    },
    "&.cm-focused": {
        outline: 'none',
    },
    "& .cm-scroller": {
        borderTopLeftRadius: 'var(--mantine-radius-md)',
        borderTopRightRadius: 'var(--mantine-radius-md)',
    },
    "& div.cm-panels.cm-panels-bottom": {
        borderTop: "none",
        borderBottomLeftRadius: 'var(--mantine-radius-md)',
        borderBottomRightRadius: 'var(--mantine-radius-md)',
    },
    ".cm-help-panel": {
        padding: "6px 12px",
        fontSize: "13px",
        fontFamily: "monospace",
    },
    ".cm-help-panel kbd": {
        display: "inline-block",
        padding: "2px 6px",
        fontSize: "12px",
        backgroundColor: "#e2e8f0",
        color: 'var(--mantine-color-black)',
        borderRadius: "4px",
        margin: "0 2px",
    },
    '.cm-help-panel a': {
        color: 'var(--mantine-color-anchor)',
        '&:hover': {
            color: 'var(--mantine-primary-color-filled-hover)'
        }
    },
    '.cm-help-panel code': {
        color: 'var(--mantine-primary-color-contrast)'
    }
})