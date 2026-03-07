const mongoose = require('mongoose');
const musicModel = require('../models/music.model');
const { uploadFile } = require('../services/storage.service');
const jwt = require('jsonwebtoken');

async function createMusic(req, res) {

   
    try {
         const token = req.cookies.token;
         if (!token) {
           return res.status(401).json({
             message: "Unauthorize access",
           });
         }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'artist') {
            return res.status(403).json({
                message: "Forbidden"
            })
        }
            const { title } = req.body;
            const file = req.file;

            const result = await uploadFile(file.buffer.toString("base64"));

            const music =  musicModel.create({
              uri: result.url,
              title,
              artist: decoded.id,
            })
        

            res.status(201).json({
              message: "Music created successfully",
              music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
              },
            })
        
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    

}
module.exports = { createMusic }