import { extendTheme, theme } from "@chakra-ui/react";

export default extendTheme({
    colors:{
        primary: theme.colors["teal"]
    },
    styles: {
        global:{
            body:{
                backgroundColor:  '#20bf55',
                bgGradient: 'linear(315deg,blue.200,green.200)'
            }
        }
    }
})

