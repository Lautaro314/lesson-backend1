const { error } = require("console");
const fs = require("fs")

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async addNewCart () {
        try {

            let carts = [];
            
            if(fs.existsSync(this.path)) {

                const data = await fs.promises.readFile (this.path , "utf-8");
                carts = JSON.parse(data);

            }

            //ACA ES DONDE CREAMOS EL ID AUTOGENERADO Y EL ARRAY DONDE ESTARÁ INVOLUCRADO EL OBJETO
            const newCart = {
                id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                products: []
            }

            carts.push(newCart)

            await fs.promises.writeFile(this.path , JSON.stringify(carts , null , 2))
            return newCart

        } catch (error) {
            console.error("Error al generar el carrito" , error);
            return null
        }
    }

    
    async getCart(cid) {
        
        try {
            let carts = []

            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile (this.path , "utf-8");
                carts = JSON.parse(data);
            }

            const productos = carts.find((product) => product.id === cid)

            if (!productos) {
                console.log("Producto no encontrado");
                return null
            }

            if (productos) {
                return productos.products
            }
        
        } catch (error) {
            console.log("Error al listar los productos" , error);
        }
    }


    async addProductToArray (cid , pid) {
        try {
            let carts = []

            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile (this.path , "utf-8");
                carts = JSON.parse(data);
            }

            console.log("Carritos cargados:" , carts);
            

            const producto = carts.findIndex(cart => cart.id === cid);
            console.log("Indice del carrito" , producto);
            

            if (producto === -1) {
                return null
            }

            const cart = carts[producto];
            console.log("carrito encontrado" , cart);
            

            const productoIndex = cart.products.findIndex(p => p.product === pid)
            console.log("indice del producto:" , productoIndex);
            
            if(productoIndex === -1){
                console.log("➕ Producto nuevo, se agrega");
                cart.products.push({
                    product: pid,
                    quantity: 1
                });
            
            } else {
                console.log("🔁 Producto existente, se incrementa quantity");
                cart.products[productoIndex].quantity +=1;
            }

            carts[producto] = cart;

            await fs.promises.writeFile(this.path , JSON.stringify(carts , null , 2))
            return cart

        } catch (error) {
            console.log("Error al agregar un producto al carrito" , error);
            return null
        }
    }
}

module.exports = {CartManager};

const cartManager = new CartManager("./carts.json");


(async () => {
    const cartManager = new CartManager("./carts.json");

    console.log("🛒 Crear carrito");
    const cart = await cartManager.addNewCart();
    console.log(cart);

    console.log("➕ Agregar producto 1");
    await cartManager.addProductToArray(cart.id, 1);

    console.log("➕ Agregar producto 1 otra vez");
    await cartManager.addProductToArray(cart.id, 1);

    console.log("➕ Agregar producto 2");
    await cartManager.addProductToArray(cart.id, 2);

    console.log("📦 Obtener productos del carrito");
    const products = await cartManager.getCart(cart.id);
    console.log(products);
})();
