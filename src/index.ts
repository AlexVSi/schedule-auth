import 'dotenv/config'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import cookieParser from 'cookie-parser'
import router from '~/routes/index'
import { errorHandler } from '~/middleware/error.middleware'

const PORT = process.env.PORT || 6000;
const CLIENT_URL = process.env.CLIENT_URL

const app = express()

const corsOptions: CorsOptions = {
    credentials: true,
    origin: CLIENT_URL,
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use('/', router)
app.use(errorHandler)

const startApp = async (): Promise<void> => {
    try {
        await app.listen(PORT, () => console.log('Server start on port', PORT))
    } catch (e) {
        console.log(e)
    }
}

startApp()
