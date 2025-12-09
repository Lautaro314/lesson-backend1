const fs = require("fs");

class ProductManager {
    constructor() {
        this.path="productos.json";
        this.carrito= [];
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




    async addNewProduct({id ,title , price , status , stock , categoria}) {
        try {
            const producto = await fs.promises.readFile(this.path , "utf-8");
            const data = JSON.parse(producto)
            if (!title || !price || !status || !stock || !categoria) {
                console.log("No se puede generar el nuevo producto");
                return null;
            }

            //GENERO UN ID AUTOMATICO
            const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
            
            //GENERO EL NUEVO PRODUCTO
            const newProduct = {
                id:newId,
                title,
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
        }
    }




    async updateProduct (id , camposDelProducto) {
        try {
            const producto = await fs.promises.readFile(this.path , "utf-8")
            const data = JSON.parse(producto);

            const index = data.findIndex(p => p.id === id)

            if (index === -1) {
                console.log("Producto no encontrado");
                return null;
            }
            
            if ("id" in camposDelProducto) {
                delete camposDelProducto.id;
            }

            data[index] = {
                ...data[index],
                ...camposDelProducto
            }

            await fs.promises.writeFile(this.path , JSON.stringify(data , null , 2))
            console.log("Producto encontrado" , data[index]);
            return data[index]

        } catch (error) {
            console.error("Error al actualizar los productos" , error);
            
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

//const pm = new ProductManager();
/*
pm.getProducts().then((prod) => {
    console.log("Productos obtenidos" , prod);
})
*/
/*
pm.deleteProduct(2).then((prod) => {
    console.log("Se eliminó:" , prod);
    
})
*/
/*
//ACTUALIZAR EL PRODUCTO
pm.updateProduct(3, {
    title: "Bermudas sin roturas diseñadas",
    stock: 6,
    price: 24000 
})
*/

//TRAER TODO LOS PRODUCTOS 
/*
(async () => {
    const nuevoProducto = await pm.addNewProduct( {
        title: "Zapatillas Campus",
        price: 45000,
        status: true,
        stock: 10,
        categoria: "Calzado" 
    })
    console.log("Nuevo producto:" , nuevoProducto);
    
})();
*/
/*
(async () => {
    const nuevoProducto = await pm.addNewProduct( {
        title: "Remeras musculosas con capucha",
        price: 80000,
        status: true,
        stock: 10,
        categoria: "Camperas" 
    })
    console.log("Nuevo producto:" , nuevoProducto);
})();
*/
/*
pm.getProductById(2).then((productos) => {
    console.log("Productos obtenidos");
});
*/


//TRAER EL ID DEL ARRAY
/*
(async () => {
    const producto = await pm.getProductById(2);
    console.log("Producto encontrado:" , producto);
})
    */