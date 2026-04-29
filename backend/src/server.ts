import dotenv from "dotenv"
import path from "path"

// Load env vars BEFORE any other imports that depend on them
dotenv.config({ path: path.resolve(__dirname, ".env") })

import app from "./app"
import { rankingService } from "./services/ranking.service"

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // Recalculate scores on startup
    await rankingService.recalculateAllScores()

    // Then every hour
    setInterval(
        () => rankingService.recalculateAllScores(),
        60 * 60 * 1000
  )
})