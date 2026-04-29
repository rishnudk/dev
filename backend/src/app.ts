

import express from "express"
import helmet from "helmet"
import {healthRoute} from "./routes/health.route"
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
import {errorMiddleware} from "./middlewares/error.middleware"
import portfolioRouter from "./routes/portfolio.route"
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

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/portfolios', portfolioRouter)
app.use(errorMiddleware)

export default app