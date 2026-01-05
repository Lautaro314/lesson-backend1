const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path=path;
        this.products= [];
    }


    async getProducts () {
        try {
            const producto = await fs.promises.readFile(this.path , "utf-8");
            const data= JSON.parse(producto)

            console.log(data);
            return data       

        } catch (error) {
            console.error("Error al obtener los productos" , error);
            return[]
        }
    }



    async getProductById(id) {
        try {
            const producto = await fs.promises.readFile(this.path , "utf-8");
            const data = JSON.parse(producto)
            if(data) {
                const productid= data.find((product) => product.id === id);
                console.log(productid);
                return productid;
            }
        } catch (error) {
            console.error("error al obtener los productos" , error);
        }
    }




    async addNewProduct({producto , price , status , stock , categoria}) {
        try {
            const producto1 = await fs.promises.readFile(this.path , "utf-8");
            const data = JSON.parse(producto1)
            if (!producto || price == null || status == null || stock == null || !categoria) {
                console.log("No se puede generar el nuevo producto");
                return null;
            }

            //GENERO UN ID AUTOMATICO
            const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
            
            //GENERO EL NUEVO PRODUCTO
            const newProduct = {
                id:newId,
                producto,
                price,
                status,
                stock,
                categoria,
            }

            //AGREGO EL NUEVO PRODUCTO EN EL ARRAY DE OBJETO
            data.push(newProduct)
            await fs.promises.writeFile(this.path , JSON.stringify(data , null , 2))

            console.log("Nuevo producto" , newProduct);
            return newProduct;

        } catch (error) {
            console.error("Error al agregar un nuevo producto" , error);
            return null
        }
    }




    async updateProduct (id , camposDelProducto) {
        try {
            const data = await fs.promises.readFile(this.path , "utf-8")
            const products = JSON.parse(data);

            const index = products.findIndex((product) => product.id === Number.id)

            if (index === -1) {
                console.log("Producto no encontrado");
                return null;
            }

            //evitar que se modifique el id
            if ("id" in camposDelProducto) {
                delete camposDelProducto.id;
            }

            //cambios del mismo producto
            products[index] = {
                ...products[index],
                ...camposDelProducto,
            };

            await fs.promises.writeFile(this.path , JSON.stringify(products , null , 2))
            return products[index]

        } catch (error) {
            console.error("Error al actualizar los productos" , error);
            return null
        }
    }

    
    
    
    async deleteProduct (id) {
        try {
            const producto = await fs.promises.readFile(this.path , "utf-8");
            const data = JSON.parse(producto);

            const productos = data.find((product) => product.id === id);

            if (!productos) {
                console.log("Producto no encontrado");
                return null;
            }

            const newData = data.filter((product) => product.id !== id)

            await fs.promises.writeFile(this.path , JSON.stringify(newData , null , 2))
            console.log("Producto encontrado");
            return newData;

        } catch (error) {
            console.error("Error al eliminar un producto" , error);
            
        }
    }


}

module.exports = {ProductManager}

