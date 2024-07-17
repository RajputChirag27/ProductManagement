import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import fs from 'fs-extra'
import path from 'path'

const uploadDir = path.join(__dirname, '..', 'uploads')

// Ensure the uploads directory exists
fs.ensureDirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //console.log(req.body)
    // console.log(req.body);
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    ////console.log(req.body)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, uniqueSuffix + ext)
  }
})

export const upload = multer({ storage: storage })
