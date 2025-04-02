import { Button, createTheme, MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = createTheme({
    fontFamily: 'EB Garamond, serif',
    components: {
        Button: Button.extend({
            styles: {
                root: { fontFamily: 'system-ui' },
            },
        }),
    }
});