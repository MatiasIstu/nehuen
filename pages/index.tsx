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
  const [day,setDayValue] = React.useState('')
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
  const { isOpen: isFirstOpen, onOpen: onFirstOpen, onClose: onFirstClose } = useDisclosure()
  const { isOpen: isSecondOpen, onOpen: onSecondOpen, onClose: onSecondClose } = useDisclosure()
  const { isOpen: isThirdOpen, onOpen: onThirdOpen, onClose: onThirdClose } = useDisclosure()

  const [cart, setCart] = React.useState<Product[]>([]);




  function sendData(cart) {
    var data;


    for (let i = 0; i < cart.length; i++) {
      data = '';
      data = data.concat([name, number, address, new Date().toLocaleString(),day, cart[i].title, cart[i].price, comment].join(','));
      fetch("https://script.google.com/macros/s/AKfycbxAl4AO22GKqLqI30zPV_rrTXQoUCodiPus0Kib4Uwakj-AY5mjQq3Qg1GIV8RFrg5d/exec", {
        method: 'POST',
        body: data,
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/csv;charset=utf-8',
        }
      }).then(response => {
        console.log("Success:", response);
        onFirstClose();
        onSecondOpen();
        cart = []
        console.log(cart);
      }).catch(err => {
        console.log("Error:" + err);
      });
    }

  }
  function setCartAndQuant(product){
    
    let found = 0;
    
    for(let i=0;i<cart.length;i++){
      if(cart[i].id == product.id){
        product.quant = product.quant + 1
        found = 1
        setCart(cart)
        return;
      }
    }
    if(found == 0){
      setCart((cart) => cart.concat(product))
    }
  }

  function setDay(arg0: string): void {
    setDayValue(arg0)
  }


  function filtrarVacios(product: Product): boolean{
    return product.quant > 0

  }

  function deleteProduct(product){

  const mapProductos = function mapear(producto: Product): Product{
    if(product.id == producto.id){
      console.log("Estoy entrando aca")
      product.quant = product.quant - 1;
    }
    return producto
  }
    setCart(cart.map(mapProductos).filter(filtrarVacios))

    console.log("Carro despues de setear:" , cart)
  }

  function getTotal() {

    let totalPrice = 0
    for (let i = 0; i < cart.length; i++) {
      totalPrice = totalPrice + cart[i].price
    }
    setTotalValue(JSON.stringify(totalPrice) + '$');
  }

  function getTotalProducts(){
    let sum = 0;
    for(let i=0;i<cart.length;i++){
      sum = sum + cart[i].quant
    }
    return sum;
  }

  return (

    <Stack spacing={6}>
    <Modal isOpen={isThirdOpen && cart.length > 0} onClose={onThirdClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Resumen de su compra</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {cart.map((product) => (
          <Stack
            key={product.id}
            backgroundColor="blue.50"
            padding={4}
            spacing={3}
          >
            <Stack spacing={1}  >
              <Stack spacing={1}>
                <Text>{product.title}</Text>
                <Text>Cantidad: {product.quant}</Text>
              </Stack>
              <Button
                colorScheme="primary"
                size="xs"
                variant="outline"
                onClick={() =>  deleteProduct(product)}
              >
                Eliminar
              </Button>
            </Stack>

          </Stack>
        ))}
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="space-around">
            <Button colorScheme='blue' onClick={()=>{
                                                onFirstOpen()
                                                onThirdClose()}}>
              Siguiente paso
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pedido Confirmado</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Su pedido ha sido confirmado! Muchas gracias
          </ModalBody>
          <ModalFooter alignItems="center" justifyContent="space-around">
            <Button colorScheme='blue' onClick={() => {
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
                <Checkbox onChange={()=>setDay('Martes')}>Envio a domicilio (Martes)</Checkbox>
                <Checkbox  onChange={()=>setDay('Jueves')}>Envio a domicilio (Jueves)</Checkbox>
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
                onClick={() => {
                  setCartAndQuant(product)}}
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
            colorScheme="whatsapp"
            onClick={() => {
              onThirdOpen()
              getTotal()
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


