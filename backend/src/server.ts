import app from "./app"
import dotenv from "dotenv"


dotenv.config({ path: "src/config/.env" })

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})