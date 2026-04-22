

import express from "express"
import helmet from "helmet"
import {healthRoute} from "./routes/health.route"
import {errorMiddleware} from "./middlewares/error.middleware"
import cors from "cors"
import morgan from "morgan"

const app = express()

app.use(helmet())
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(cors({ origin: 'http://localhost:3000', credentials: true}))
app.use(morgan('dev'))

app.use('/', healthRoute)

app.use(errorMiddleware)

export default app