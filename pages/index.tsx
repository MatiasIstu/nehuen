import { GetStaticProps } from "next";
import { CheckboxGroup, Box } from "@chakra-ui/react";
import { Product } from "../product/types";
import api from "../product/api";
import {
  DrawerCloseButton,
} from '@chakra-ui/react'
import { IndexRoute } from "./IndexRoute";
export interface Props {
  products: Product[];
}

export function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

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


