import express from "express"
import cors from "cors"


const app =express()
app.use(cors())

app.use(express.json({limit: "16kb"}))//jab form bhara toh iska matlb ki mai json ko accept kar raha hu
app.use(express.urlencoded({extended:true,limit:"16kb"}))//url se jo data ayega aur extended ka matlb hota ki hum object ke andar object de sakte
app.use(express.static("public"))

import QrRouter from "./routes/qr.routes.js"

app.use("/api/v1/users",QrRouter)

export {app}
