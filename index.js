const express = require('express');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/auth');
const productRouter = require('./routes/productRoutes')
const blogRouter = require('./routes/blogRouter')
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const dotenv = require('dotenv').config()
const app = express();
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const PORT = process.env.PORT || 5000


//Calling Database, so the Database can Connect
dbConnect()

app.get("/", (req,res)=>{ res.send("hello man") })
// app.use(express.json())
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cookieParser());

//Routes
app.use('/api/user',authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)

//Middleware
app.use(notFound)
app.use(errorHandler)

//Deploy the Server using Port
app.listen(PORT, ()=>{
    console.log('server is running successfully in '+ PORT);
})