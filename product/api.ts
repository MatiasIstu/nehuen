import { Product } from "./types";
import axios from "axios";
import { resolve } from "path";
import Papa from "papaparse";


export default {
    list: async ():Promise<Product[]> =>{
        return axios.get(
            'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsP4hCXusGoZvEEnYfwLR65JM-F5fAnA_7ptlwySwaRbA-FTQ9C2EnHwEoIuO-HO3NlHAmJccVIAjB/pub?output=csv',
            {
                responseType:'blob'
            }
        ).then(response=>{
            return new Promise<Product[]>((resolve,reject)=>{
                Papa.parse(response.data,{
                    header:true,
                    complete: results=>{
                        const products = results.data as Product[]
                        for(let i=0;i<products.length;i++){
                            products[i].quant = 1
                        }
                        return resolve(products.map(product=>({
                            ...product,
                            price: Number(product.price),

                        })))
                    },
                    error: (error) =>{
                        return reject(error.message);
                    }
                });
            })
        });
    }
}