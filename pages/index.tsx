import React from 'react';
import { GetStaticProps } from 'next';


import { Product } from '../product/types';
import api from '../product/api';
import { Box, Button, Flex, Grid, Link, Stack, Text } from '@chakra-ui/react';

interface Props {
  products: Product[];
}

function parseCurrency(value:number): string{
  return value.toLocaleString('es-AR',{
    style:'currency',
    currency:'ARS'
  })
}

const IndexRoute: React.FC<Props> = ({products}) => {

  const [cart, setCart] = React.useState<Product[]>([]);
  const text = React.useMemo(
    ()=>
    cart
    .reduce((message,product)=> message.concat(`*${product.title} - $${parseCurrency(product.price)}\n`),'',
    ).concat(`\nTotal:${parseCurrency(cart.reduce((total,product)=>total + product.price,0))}`),
  [cart]);
  
  return(
    <Stack spacing={6}>
        <Grid gridGap={6} templateColumns="repeat(auto-fill,minmax(1fr,200px));">
    {products.map((product)=> (
    <Stack spacing={3} borderRadius="md" padding={4} key={product.id} backgroundColor="gray.100">
      <Stack spacing={1}>
      <Text>{product.title}</Text>
      <Text fontSize="sm" fontWeight="500" color="green.500">{parseCurrency(product.price)}</Text>
      </Stack>
      <Button onClick={()=>setCart(cart=>cart.concat(product))}  
      variant="outline"
      size="sm"

      colorScheme="primary"
      >Agregar</Button>
            </Stack>))}
  </Grid>
  {Boolean(cart.length) && ( 
    <Flex bottom={4} position="sticky"  alignItems="center" justifyContent="center">
  <Button
    isExternal
    as={Link}
    width="fit-content"
    margin="auto"
    colorScheme="whatsapp"
    href={`http://wa.me/5491134712227?text=${encodeURIComponent(text)}`} 

   >
    
    Completar Pedido ({cart.length} productos) </Button> 
    </Flex>
  )}
    </Stack>
  );
};


export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return{
    revalidate: 10,
    props: {
      
      products,
    },
      
  }
}

export default IndexRoute;