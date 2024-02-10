import express from "express"
import postgresClient from './config/db.js'
import userRouter from './routers/userRouter.js'

const app = express()
app.use(express.json())

app.use('/users',userRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Listening on port :" + PORT)
    postgresClient.connect(err => {
        if (err) {
            console.log('Connection Eroorrr: ', err.stack);
        } else {
            console.log('db connection successful');   
        }
    })
})