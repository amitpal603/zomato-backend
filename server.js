require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")

connectDB()


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})