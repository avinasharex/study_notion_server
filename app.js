import { config } from "dotenv"
config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import userRoutes from "./routes/userRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [process.env.FRONTED_URL],
    credentials: true
}))


app.use(morgan("dev"))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)

app.all("*", (req, res) => {
    res.status(404).send("OOPS! 404 page not found")
})


export default app