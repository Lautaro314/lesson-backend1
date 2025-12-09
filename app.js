const express = require("express")
const fs = require("fs");
const {ProductManager} = require("./src/productManager");
const { error } = require("console");
//const { error } = require("console");

const app = express()
const port = 8080;
app.use(express.json())

const manager = new ProductManager('./productos.json')

app.get("/products" , async (req , res) => {

    try {
        
        const producto = await manager.getProducts()
        res.json(producto)
        return producto
    
    } catch (error) {
        res.status(400).json({error: "Error al obtener los productos disponibles"})
    }
    
})


app.get("/products/:pid" , async (req , res) => {
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

app.post("/products" , async  (req , res) => {
    
    try {

        const nuevoProducto = req.body;
        const productoAgregado = await manager.addNewProduct(
            nuevoProducto.producto,
            nuevoProducto.price,
            nuevoProducto.stock,
            nuevoProducto.status,
            nuevoProducto.category
        );

        res.status(201).json({
        success: true, 
        producto: productoAgregado
    })

    } catch (error) {
        res.status(400).json({error: "Error al obtener un nuevo Producto"})
    }

})

app.put("/products/:pid" , async (req , res) => {

    try {
        const pid = parseInt(req.params.pid)
        const campos = req.body;
        const productoActualizado = await manager.updateProduct(pid , campos);

        if (productoActualizado) {
            return res.json(productoActualizado)
        }
    
    } catch (error) {
        res.status(400).json({error: "Error al obtener un nuevo Producto"})
    }

})

app.delete("/products/:pid" , async (req , res) => {
    
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


app.listen(port , () => {
    console.log("Escuchando en el puerto" , port);
})