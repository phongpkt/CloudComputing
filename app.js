const express = require('express')
const app = express()
const fs = require('fs')

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

//products la mot array: rong
var products = []

app.post('/addProduct', (req, res)=>{
    //1. lay du lieu tu nguoi dung
    const id = req.body.txtid
    const name = req.body.txtname
    const price = req.body.txtprice
    //2. load du lieu file
    readFileToArray()
    //3. cap nhat array
    products.push({'id':id,'name':name, 'price':price})
    //4. save xuong file
    saveArray2File()
    //5. chuyen huong nguoi dung
    res.redirect('/')
})

app.get('/addProduct', (req, res) => {
    res.render('addProduct')
})

app.get('/delete', (req, res) => {
    const id = req.query.id
    //1. xoa product khoi array
    let productToDeleteIndex =-1
    for(i=0;i<products.length;i++){
        if(products[i].id== id){
            productToDeleteIndex = i
            break
        }
    }
    //xoa vi tri thu i, xoa 1 item, 
    products.splice(productToDeleteIndex,1)
    //2. Save array vao file
    saveArray2File()
    //huong nguoi dung den trang hom
    res.redirect('/viewproducts')
})

app.get('/viewproducts', (req, res) =>{
    //cho 1 so product vao array tren
    // products.push({'id':1,'name': 'Iphone', 'price':20})
    // products.push({'id':2,'name': 'Samsung', 'price':40})
    readFileToArray()
    //hien thi products trong 1 view showProducts
    res.render('showProducts', {'products':products})
})

app.get('/', (req, res) =>{
    //lay ngay hien tai tren server
    const now = new Date()
    //goi den mot view ten la home
    res.render('home',{'now':now})
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running at: " + PORT)

function saveArray2File() {
    let fileContent = ''
    let singleItem = ''
    for (i = 0; i < products.length; i++) {
        //tao ra dong: '1/IPhone/220' hoac '2/SamsungPhone/444'
        singleItem = products[i].id + '/' + products[i].name + '/' + products[i].price + '\n'
        fileContent += singleItem
    }
    fs.writeFileSync('productDB.txt', fileContent)
}

function readFileToArray (){
    //doc file va cho vao bien product
    const content = fs.readFileSync('productDB.txt', "utf8")
    //productRaw la mot array, moi phan tu la cac dong
    const productRaw = content.split('\n')
    //xoa bo noi dung cu neu co trong bien product
    products = []
    //duyet tung phan tu trong productRaw
    for (i = 0; i <productRaw.length; i++) {
        if(productRaw[i].length != 0){
            const productdata = productRaw[i].split('/')
            const id = productdata[0]
            const name = productdata[1]
            const price = productdata[2]
            products.push({'id':id,'name': name,'price':price})
        }
    }
}