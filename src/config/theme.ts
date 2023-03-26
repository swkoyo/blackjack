import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    useSystemColorMode: false,
    initialColorMode: 'dark'
};

const colors = {
    board: '#00773B'
};

const theme = extendTheme({
    config,
    colors
});

export default theme;
