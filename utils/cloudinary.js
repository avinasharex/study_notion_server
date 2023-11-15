import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINAR_CLOUD_NAME,
    api_key: process.env.CLOUDINAR_CLOUD_KEY,
    api_secret: process.env.CLOUDINAR_CLOUD_SECRET
})

const uploadOnCloudinar = async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
     const response =  await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file uploaded on cloudinar", response.url);
        return response
    } catch (error) {
        // remove the locally saved temporary files as the upload operation got failed
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinar}