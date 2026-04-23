import dotenv from "dotenv"
import path from "path"

// Load env vars BEFORE any other imports that depend on them
dotenv.config({ path: path.resolve(__dirname, ".env") })

import app from "./app"

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})