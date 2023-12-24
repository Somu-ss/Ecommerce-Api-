const cloudinary = require('cloudinary')

          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API, 
  api_secret: process.env.API_SECRET 
});

const cloudinaryImgUpload = async (fileToUploads)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(fileToUploads, (result)=> {
            resolve({
                url: result.secure_url,
            },{
                resource_type: "auto",
            })
        })
    })
}


module.exports = {cloudinaryImgUpload}