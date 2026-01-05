const express = require("express")
const {ProductManager} = require("./src/productManager");
const {CartManager} = require("./src/cartManager")

const app = express()
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const manager = new ProductManager('./productos.json')
const cartManager = new CartManager('./carts.json')


//SERVIDOR DE PRODUCTOS

app.get("/api/products" , async (req , res) => {

    try {
        
        const producto = await manager.getProducts()
        res.json(producto)
        return producto
    
    } catch (error) {
        res.status(400).json({error: "Error al obtener los productos disponibles"})
    }
    
})


app.get("/api/products/:pid" , async (req , res) => {
    try {
        const pid = parseInt(req.params.pid)
        const productoId = await manager.getProductById(pid);

        if (productoId){
            return res.json(productoId)
        }

    } catch (error) {
        res.status(400).json({error: "Error al obtener el producto"})
    }
})

app.post("/api/products" , async  (req , res) => {
    
    try {

        console.log("REQ BODY:" , req.body);
        

        const nuevoProducto = req.body;
        const productoAgregado = await manager.addNewProduct({
            producto: nuevoProducto.producto,
            categoria: nuevoProducto.categoria,
            price: nuevoProducto.price,
            stock: nuevoProducto.stock,
            status: nuevoProducto.status,
        });

        if (!productoAgregado) {
            return res.status(400).json({error: "Campos incompletos"});
        }

        res.status(201).json({
        success: true, 
        producto: productoAgregado
    });

    } catch (error) {
        res.status(400).json({error: "Error al obtener un nuevo Producto"})
    }

})


app.put("/api/products/:pid" , async (req , res) => {

    try {
        const pid = Number(req.params.pid)
        const campos = req.body;
        const productoActualizado = await manager.updateProduct(pid , campos);

        if (!productoActualizado) {
            return res.status(400).json({error : "Producto no encontrado"})
        }

        res.status(200).json({
            success: true,
            message: "Producto actualizado correctamente",
            producto: productoActualizado
        })
    
    } catch (error) {
        res.status(500).json({error: "Error al obtener un nuevo Producto"})
    }

})


app.delete("/api/products/:pid" , async (req , res) => {
    
    try {
        const pid = parseInt(req.params.pid)
        const productoEliminados = await manager.deleteProduct(pid)

        if (!productoEliminados) {
            return res.json({error: "Producto no encontrado"})
        }

        return res.json({message: "Producto eliminado"})
    
    } catch (error) {
        res.status(400).json({error: "Error al Eliminar el producto"})
    }

})



//SERVIDOR DE CART
app.post("/api/carts" , async (req , res) => {
    try {
        
        const carrito = await cartManager.addNewCart()
        res.status(201).json(carrito)
        console.log(carrito);
        
    
    } catch (error) {
        res.status(400).json({error: "Error al crear el carrito"})
    }
})




//crear un nuevo carrito 
app.get("/api/carts/:cid" , async (req , res) => {
    try {
        const cid = parseInt(req.params.cid);
        const data = await cartManager.getCart(cid)

        if (!data) {
            res.status(404).json({error: "No se puede implementar el carrito"})
            return null
        }

        res.status(200).json({
            cartId: cid,
            producto: data
        })

    } catch (error) {
        res.status(400).json({error: "Error al crear el carrito"})
    }
})




//AGREGAR UN NUEVO PRODUCTO
app.post("/api/carts/:cid/product/:pid" , async (req , res) => {

    try {
        
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid);
        const producto = await cartManager.addProductToArray(cid , pid);

        if (!producto) {
            res.status(400).json({error: "carrito no encontrado"})
            return null
        }

        res.status(200).json({
            success: true,
            producto
        });
    
    } catch (error) {
        res.status(400).json({error: "Error al agregar el producto"})
    }

})


app.listen(port , () => {
    console.log("Escuchando en el puerto" , port);
})