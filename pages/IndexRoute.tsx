import React, { useState } from "react";
import {
  Checkbox,
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Stack,
  Image,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Product } from "../product/types";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent } from '@chakra-ui/react';
import { Props, parseCurrency } from ".";


export const IndexRoute: React.FC<Props> = ({ products }) => {
  const [day, setDay] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const { isOpen: isThirdOpen, onOpen: onThirdOpen, onClose: onThirdClose } = useDisclosure();
  const { isOpen: isSecondOpen, onOpen: onSecondOpen, onClose: onSecondClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const categories = ["Frutas", "Verduras", "Almacén"];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isOpen: isFirstOpen, onOpen: onFirstOpen, onClose: onFirstClose } = useDisclosure();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value);
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => setNumber(event.target.value);
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => setAddress(event.target.value);
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => setComment(event.target.value);

  function handleSetDay(dayValue: string) {
    setDay(dayValue);
  }

  function setCartAndQuant(product: Product) {
    const updatedCart = [...cart];
    const index = updatedCart.findIndex((p) => p.id === product.id);

    if (index !== -1) {
      updatedCart[index].quant += 1;
    } else {
      product.quant = 1;
      updatedCart.push(product);
    }

    setCart(updatedCart);
  }

  function deleteProduct(product: Product) {
    const updatedCart = cart.map((p) => {
      if (p.id === product.id) {
        p.quant -= 1;
      }
      return p;
    }).filter((p) => p.quant > 0);

    setCart(updatedCart);

    if (updatedCart.length === 0) {
      onThirdClose();
    }
  }

  function obtenerArrayDeCantidades(carrito, longitud) {
    const cantidadesMap = {};
    carrito.forEach((producto) => {
      cantidadesMap[producto.id] = producto.quant || 0;
    });

    const cantidadesArray = Array.from({ length: longitud }, (_, index) => {
      return cantidadesMap[index + 1] || 0;
    });

    return cantidadesArray;
  }

  function getTotalPrice(): number {
    return cart
      .filter((product) => !selectedCategory || product.category === selectedCategory)
      .reduce((total, product) => total + product.price * product.quant, 0);
  }

  function getTotalProducts(): number {
    return cart.reduce((total, product) => total + product.quant, 0);
  }

  async function sendData(cart: Product[]) {
    const date = new Date().toISOString().substring(0, 19);

    if (day !== 'Martes' && day !== 'Jueves') {
      setDay('-');
    }

    setLoading(true);
    const array = obtenerArrayDeCantidades(cart, products.length);
    console.log(array)
    const data = [name, number, address, date, day, getTotalPrice(), comment].concat(array).join(',');

    try {
      await fetch("https://script.google.com/macros/s/AKfycbxAl4AO22GKqLqI30zPV_rrTXQoUCodiPus0Kib4Uwakj-AY5mjQq3Qg1GIV8RFrg5d/exec", {
        method: 'POST',
        body: data,
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
        },
      });
      console.log("Success");
    } catch (error) {
      console.error("Error: ", error);
    }

    onFirstClose();
    onSecondOpen();
    setCart([]);
  }

  return (
    <Stack spacing={6}>
// Contenido del tercer modal
      <Drawer placement="right" onClose={onThirdClose} isOpen={isThirdOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Informacion del pedido</DrawerHeader>
          <DrawerBody>
            {/* Contenido del tercer modal: Información del pedido */}
            {cart.map((product) => (
              <Stack
                key={product.id}
                backgroundColor="blue.50"
                padding={4}
                spacing={3}
                width="105%"
              >
                <Stack spacing={1}>
                  <Text>{product.title}</Text>
                  <Stack justifyContent="space-between" direction="row">
                    <Text>Cantidad: {product.quant}</Text>
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
          </DrawerBody>
          <DrawerFooter alignItems="center" justifyContent="space-around">
            <Text as='u' color="green.600" fontSize="lg" fontWeight="400">
              Total: ${getTotalPrice()}
            </Text>
            <Button colorScheme='facebook' onClick={() => {
              onFirstOpen();
              onThirdClose();
            }}>
              Siguiente paso
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

// Contenido del segundo modal
      <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido Confirmado</ModalHeader>
          <ModalBody>
            Su pedido ha sido confirmado! Muchas gracias
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="space-around">
            <Button colorScheme='facebook' onClick={() => {
              setLoading(false);
              onSecondClose();
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
            <FormControl isRequired>
              <Stack spacing={3} direction='column'>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='name'>Nombre</FormLabel>
                  <Input id='name' re type='name' onChange={handleNameChange} value={name} />
                </Stack>
                <Stack spacing={-1}>
                  <FormLabel htmlFor='number'>Telefono</FormLabel>
                  <Input id='numero' type='string' onChange={handleNumberChange} value={number} />
                </Stack>
              </Stack>
            </FormControl>
            <FormControl>
              <Stack spacing={3} direction='column'>
                <Text textAlign="center"> El envio tiene un costo adicional (Consultar) </Text>
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
              sendData(cart);
              setLoading(true);
            }}>
              Enviar pedido
            </Button>
            {Boolean(loading) && (
              <Spinner />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Flex justifyContent="center" alignItems="center" marginBottom={4}>
        <Button
          variant={!selectedCategory ? "solid" : "outline"}
          colorScheme="primary"
          onClick={() => setSelectedCategory(null)}
          marginRight={4}
        >
          Mostrar Todos
        </Button>
        {categories.map((category, index) => (
          <React.Fragment key={category}>
            {index > 0 && <Box marginLeft={2} marginRight={2}>|</Box>}
            <Button
              variant={selectedCategory === category ? "solid" : "outline"}
              colorScheme="primary"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          </React.Fragment>
        ))}
      </Flex>

      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(300px, 1fr))">
        {products
          .filter((product) => !selectedCategory || product.category === selectedCategory)
          .map((product) => (
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
                maxHeight={250}
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
                  onClick={() => setCartAndQuant(product)}
                >
                  Agregar
                </Button>
              </Stack>
            </Stack>
          ))}
      </Grid>

      {
        Boolean(cart.length > 0) && (
          <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
            <Button
              isExternal
              as={Link}
              colorScheme="facebook"
              onClick={() => onThirdOpen()}
              width="fit-content"
            >
              Completar pedido ({getTotalProducts()} productos)
            </Button>
          </Flex>
        )
      }
    </Stack >
  );
};

export default IndexRoute;
