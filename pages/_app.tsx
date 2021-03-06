import { ChakraProvider, Text, Image, Container, VStack, Heading, Box, Divider } from '@chakra-ui/react'
import React from 'react'
import { AppProps } from 'next/app';
import theme from '../theme';


const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Box padding={4}>
      <Container borderRadius="sm" backgroundColor="white"
      boxShadow="xl"
      maxWidth="container.xl"
      padding={4}>
        <VStack marginBottom={6}>
          <Image borderRadius={9999} src="logo.jpg" maxHeight={180}/>
          <Heading>Nehuen</Heading>
          <Text fontSize={25}>Almacen organico</Text>
        </VStack>
        <Divider marginY={6}/>
      <Component {...pageProps} />
      </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App