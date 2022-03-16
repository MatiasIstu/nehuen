import React from "react";
import { GetStaticProps } from "next";
import { Button, Flex, Grid, Link, Stack, Image, Text } from "@chakra-ui/react";

import { Product } from "../product/types";
import api from "../product/api";


interface Props {
  products: Product[];
}

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = React.useState<Product[]>([]);
  const text = React.useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(`* ${product.title} - ${parseCurrency(product.price)}\n`),
          ``,
        )
        .concat(
          `\nTotal: ${parseCurrency(cart.reduce((total, product) => total + product.price, 0))}`,
        ),
    [cart],
  );



  function sendData(cart) {
    var data;
    console.log(cart);

    for (let i = 0; i < cart.length; i++) {
      data = '';
      data = data.concat([cart[i].title, cart[i].description, cart[i].price].join(','));
      fetch("https://script.google.com/macros/s/AKfycbxAl4AO22GKqLqI30zPV_rrTXQoUCodiPus0Kib4Uwakj-AY5mjQq3Qg1GIV8RFrg5d/exec", {
        method: 'POST',
        body: data,
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
        }
      }).then(response => {
        console.log("Success:", response);
      }).catch(err => {
        console.log("Error:" + err);
      });
    }

  }

  return (
    <Stack spacing={6}>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            key={product.id}
            backgroundColor="gray.100"
            borderRadius="md"
            padding={4}
            spacing={3}
          >
            <Image
              alt={product.title}
              borderTopRadius="md"
              maxHeight={128}
              objectFit="cover"
              src={product.image}
            />
            <Stack spacing={1}>
              <Text>{product.title}</Text>
              <Text color="green.500" fontSize="sm" fontWeight="500">
                {parseCurrency(product.price)}
              </Text>
            </Stack>
            <Button
              colorScheme="primary"
              size="sm"
              variant="outline"
              onClick={() => setCart((cart) => cart.concat(product))}
            >
              Agregar
            </Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
          <Button
            isExternal
            as={Link}
            colorScheme="whatsapp"
            onClick={() => sendData(cart)}
            width="fit-content"
          >
            Completar pedido ({cart.length} productos)
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    revalidate: 10,
    props: {
      products,
    },
  };
};

export default IndexRoute;
