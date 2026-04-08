import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const theme = extendTheme({
    config,
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    styles: {
        global: {
            body: {
                bg: "var(--rc-bg)",
                color: "var(--rc-fg)",
            },
        },
    },
});

export default theme;
