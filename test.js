const express = require("express")
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/log",urlencodedParser,(req,res)=>{
    console.log(req.body.data)
    res.json({ message: "Hello from server!" });
})

app.listen(3001,()=>{
    console.log("HAHA")
})