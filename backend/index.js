const express=require('express');
const app=express()
const port=8001;
const connection = require("./database/db.js");
const cors = require("cors");
app.use(cors({
  origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/todos', require('./routes/todoRoutes.js'));
app.get('/',(req,res)=>{
    res.send("ok")
})
connection()
app.listen(port,()=>console.log(`is up at port ${port}`)
)