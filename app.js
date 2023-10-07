const express=require('express')
const { users } = require('./model/index')
const app=express()

app.set("view engine","ejs")

//db connection gareko
require("./model/index")

//hashing ko lagi bcrypt use gareko 

const bcrypt=require("bcrypt")

//aba form ko data tannu parnyo node samma

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post("/register",async(req,res)=>{
        console.log(req.body)
   /*  const email=req.body.email
    const username=req.body.username
    const password=req.body.password */

    const {email,username,password}=req.body

    if(!email || !username ||!password){
        return res.send("plz provide email usename and password")
    }

   await users.create({
        email:email,
        username:username,
        password:bcrypt.hashSync(password,8)
    })

    res.redirect("login")
})


app.get("/register",(req,res)=>{
    res.render("register")
})


//login garnalai

app.get("/login",(req,res)=>{
res.render("login")
})


app.post("/login",async(req,res)=>{
    console.log(req.body)
    const {email,password}=req.body


    //tyo email n pass vako kohi xa kinai vanera suruma table maa xa ki nai check garney
  const userExist = await users.findAll({
        where:{
                email:email
        }
    })
   if(userExist.length>0){
    //password ni check garu paryo aba chai
   const isMatch= bcrypt.compareSync(password,userExist[0].password)
   if(isMatch){
    res.send("logged in successfully")
   }
   else{
    res.send("Invalid email or password")
   }
   }
   else{
    res.send("Invalid Email or password")
   }
})


app.listen(3000,()=>{
    console.log("NOdejs running in port 3000")
})