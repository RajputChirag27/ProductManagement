import express from 'express'
import path from 'path'

const app = express()
const port = 3000

const uploadsPath = path.join(__dirname, 'uploads')
console.log('Serving static files from:', uploadsPath)

app.use('/uploads', express.static(uploadsPath))

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
