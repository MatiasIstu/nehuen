import React from "react";
import { GetStaticProps } from "next";
import { Checkbox, CheckboxGroup, Button, Flex, Grid, Link, Stack, Image, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Input, Spinner } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { Product } from "../product/types";
import api from "../product/api";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
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
  const [day, setDayValue] = React.useState('')
  const [total, setTotalValue] = React.useState('')
  const [name, setNameValue] = React.useState('')
  const [number, setNumberValue] = React.useState('')
  const [address, setAddressValue] = React.useState('')
  const [comment, setCommentValue] = React.useState('');
  const [quant, setQuantValue] = React.useState('');
  const handleNameChange = (event) => setNameValue(event.target.value)
  const handleNumberChange = (event) => setNumberValue(event.target.value)
  const handleAddressChange = (event) => setAddressValue(event.target.value)
  const handleCommentChange = (event) => setCommentValue(event.target.value)
  const { isOpen: isFirstOpen, onOpen: onFirstOpen, onClose: onFirstClose } = useDisclosure()
  const { isOpen: isSecondOpen, onOpen: onSecondOpen, onClose: onSecondClose } = useDisclosure()
  const { isOpen: isThirdOpen, onOpen: onThirdOpen, onClose: onThirdClose } = useDisclosure()
  const [loading,setLoadingValue] = React.useState(Boolean);
  const handleLoading = (event) => setLoadingValue(event.target.value)
  const [cart, setCart] = React.useState<Product[]>([]);
  const { isOpen: isSpinnerOpen, onOpen: onSpinnerOpen, onClose: onSpinnerClose } = useDisclosure()



  async function sendData(cart) {
    var data;

    var date = new Date().toLocaleDateString()
    if(date.length != 18){
      date = date.substring(0,19)
    }
    if(day != 'Martes' && day != 'Jueves'){
      setDayValue('-');
    }
    for (let i = 0; i < cart.length; i++) {
      <Spinner/>
      data = '';
      data = data.concat([name, number, address, date, day, cart[i].quant, cart[i].title, cart[i].price, comment].join(','));
      await fetch("https://script.google.com/macros/s/AKfycbxAl4AO22GKqLqI30zPV_rrTXQoUCodiPus0Kib4Uwakj-AY5mjQq3Qg1GIV8RFrg5d/exec", {
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
    cart = []
  }
  function setCartAndQuant(product) {

    let found = 0;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == product.id) {
        product.quant = product.quant + 1
        found = 1
        setQuantValue(product.quant)
        setCart(cart)
        return;
      }
    }
    if (found == 0) {
      setCart((cart) => cart.concat(product))
    }
    if (cart.length == 0) {
      onThirdClose()
    }
  }

  function setDay(arg0: string): void {
    setDayValue(arg0)
  }


  function filtrarVacios(product: Product): boolean {
    return product.quant > 0

  }

  function deleteProduct(product) {
    let todaviaSirve = 0
    const mapProductos = function mapear(producto: Product): Product {
      if (product.id == producto.id) {
        producto.quant = producto.quant - 1;

      }
      return producto
    }
    setCart(cart.map(mapProductos).filter(filtrarVacios))
    products.map(item => {
      if (item.quant == 0) {
        item.quant += 1;
      }
    })
    if (cart.length != 0) {
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].quant > 0) {
          todaviaSirve = 1
        }
      }
    }
    if (todaviaSirve != 1) {
      onThirdClose()
    }
    if (cart.length == 0) {
      onThirdClose()
    }

  }


  function getTotalPrice(): number {
    let precioTotal = 0
    for (let i = 0; i < cart.length; i++) {
      precioTotal = precioTotal + (cart[i].price * cart[i].quant)
    }
    return precioTotal
  }

  function getTotalProducts() {
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
      sum = sum + cart[i].quant
    }
    return sum;
  }

  return (

    <Stack spacing={6}>
      <Drawer placement="right" onClose={onThirdClose} isOpen={isThirdOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Informacion del pedido</DrawerHeader>
          <DrawerBody>
            <Stack direction="column" spacing={5} width="100%">
              {cart.map((product) => (
                <Stack
                  key={product.id}
                  backgroundColor="blue.50"
                  padding={4}
                  spacing={3}
                  width="105%"
                >
                    <Stack spacing={1} >
                      <Text>{product.title}</Text>
                      <Stack justifyContent="space-between" direction="row">
                        <Text >Cantidad: {product.quant}</Text>
                        <Text color="green.600">Precio Unitario: ${product.price}</Text>
                      </Stack>
                    <Stack>
                      <Button
                        colorScheme="primary"
                        size="xs"
                        variant="outline"
                        onClick={() => deleteProduct(product)}
                      >
                        Quitar Producto
                      </Button>
                    </Stack>
                  </Stack>

                </Stack>
              ))}
            </Stack>
          </DrawerBody>
          <DrawerFooter alignItems="center" justifyContent="space-around">
            <Text as='u' color="green.600" fontSize="lg" fontWeight="400">
              Total: ${getTotalPrice()}
            </Text>
            <Button colorScheme='facebook' onClick={() => {
              onFirstOpen()
              onThirdClose()
            }}>
              Siguiente paso
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido Confirmado</ModalHeader>
          <ModalBody>
            Su pedido ha sido confirmado! Muchas gracias
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="space-around">
            <Button colorScheme='facebook' onClick={() => {
              setLoadingValue(false)
              onSecondClose()
              window.location.reload();
            }}>
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
                <Checkbox onChange={() => setDay('Martes')}>Pedido para el Martes de 18hs a 21hs</Checkbox>
                <Checkbox onChange={() => setDay('Jueves')}>Pedido para el Jueves de 12hs a 17hs</Checkbox>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='address'>Direccion (Solo si se pide envio)</FormLabel>
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
            <Text as='u' color="green.600" fontSize="lg" fontWeight="400">
              Total: ${getTotalPrice()}
            </Text>
            <Button colorScheme='facebook' mr={3} onClick={() => {
            sendData(cart)
            setLoadingValue(true)
            }}>
              Enviar pedido
            </Button>
              {Boolean(loading) && (
                    <Spinner/>

              )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            key={product.id}
            backgroundColor="gray.200"
            borderRadius="5"
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
                onClick={() => {
                  setCartAndQuant(product)
                }}
              >
                Agregar
              </Button>
            </Stack>

          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length > 0) && (
        <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
          <Button
            isExternal
            as={Link}
            colorScheme = "facebook"
            onClick={() => {
              onThirdOpen()
            }}
            width="fit-content"
          >
            Completar pedido ({getTotalProducts()} productos)
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


