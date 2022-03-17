import React from "react";
import { GetStaticProps } from "next";
import { Checkbox, CheckboxGroup, Button, Flex, Grid, Link, Stack, Image, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Input } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
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

  const [total, setTotalValue] = React.useState('')
  const [name, setNameValue] = React.useState('')
  const [number, setNumberValue] = React.useState('')
  const [address, setAddressValue] = React.useState('')
  const [comment, setCommentValue] = React.useState('');
  const handleNameChange = (event) => setNameValue(event.target.value)
  const handleNumberChange = (event) => setNumberValue(event.target.value)
  const handleAddressChange = (event) => setAddressValue(event.target.value)
  const setTotal = (event) => setTotalValue(event.target.value)
  const handleCommentChange = (event) => setCommentValue(event.target.value)
  const { isOpen: isFirstOpen , onOpen: onFirstOpen, onClose: onFirstClose } = useDisclosure()
  const { isOpen: isSecondOpen , onOpen: onSecondOpen, onClose: onSecondClose } = useDisclosure()

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


    for (let i = 0; i < cart.length; i++) {
      data = '';
      data = data.concat([name, number, address, new Date().toLocaleString(), cart[i].title, cart[i].price, comment].join(','));
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
    onFirstClose();
    onSecondOpen();
  }

  function getTotal() {

    let totalPrice = 0
    for (let i = 0; i < cart.length; i++) {
      console.log(cart[i].price)
      totalPrice = totalPrice + cart[i].price
    }

    setTotalValue(JSON.stringify(totalPrice) + '$');
  }
  return (

    <Stack spacing={6}>
      <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar pedido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Su pedido ha sido confirmado! Muchas gracias
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="space-around">
            <Button colorScheme='blue' onClick={onSecondClose}>
              Volver a la pagina principal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFirstOpen} onClose={onFirstClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar pedido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Perfecto! Para armar tu pedido necesitamos unos datos mas
            <FormControl>
              <Stack spacing={3} direction='column'>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='name'>Nombre</FormLabel>
                  <Input id='name' type='name' onChange={handleNameChange} value={name} />
                </Stack>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='number' >Telefono</FormLabel>
                  <Input id='numero' type='string' onChange={handleNumberChange} value={number} />
                </Stack>
                <Checkbox >Envio a domicilio</Checkbox>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='addres'>Direccion (solo si se pide envio)</FormLabel>
                  <Input id='address' type='address' onChange={handleAddressChange} value={address} />
                </Stack>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='comment'>Comentarios adicionales</FormLabel>
                  <Input id='comment' type='comment' onChange={handleCommentChange} value={comment} />
                </Stack>
              </Stack>
            </FormControl>
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="space-around">
            <Text as='u' color="blackAlpha.800" fontSize="lg" fontWeight="400">
              Total: {total}
            </Text>
            <Button colorScheme='blue' mr={3} onClick={() => sendData(cart)}>
              Enviar pedido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            key={product.id}
            backgroundColor="gray.200"
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
            <Stack spacing={1} justifyContent="space-between" height="100%">
              <Stack spacing={1}>
                <Text>{product.title}</Text>
                <Text color="green.600" fontSize="sm" fontWeight="500">
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

          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
          <Button
            isExternal
            as={Link}
            colorScheme="whatsapp"
            onClick={() => {
              onFirstOpen()
              getTotal()
            }}
            width="fit-content"
          >
            Completar pedido ({cart.length} productos)
          </Button>
        </Flex>
      )}
      )
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
