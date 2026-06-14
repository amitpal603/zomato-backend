const Food = require('../models/food.model')
const { uploadImage } = require('../services/storage.service')
const {v4 : uuid} = require('uuid')

exports.createFood = async (req, res) => {
    const {name , description , price} = req.body

    try {
        const fileUploadResult = await uploadImage(req.file.buffer, uuid())
        
        const foodItem = await Food.create({
            name,
            description,
            price,
            videoUrl : fileUploadResult?.url,
            vendor : req.foodPartnerInfo._id,
            videoPublicId : fileUploadResult?.fileId
        })
        res.status(201).json({ success: true, data: foodItem })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Error creating food item' })
    }
}