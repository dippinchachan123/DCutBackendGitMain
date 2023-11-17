import express from "express";
import main from "../../controllers/Main";
import { upload } from "../../middleware/multer";
import Image from "../../DBModels/Image";
import path from "path";

export const appRouter = express.Router();

//Kapans
appRouter.post('/upload', async (req: any, res: any) => {
    res.json("Image Uploaded Successfully : ")
    // try {
    //     const { filename } = req.file;
    //     const imagePath = `/uploads/${filename}`;

    //     const image = new Image({
    //         path: imagePath,
    //         filename: filename,
    //     });

    //     await image.save();

    //     res.send({msg : 'Image uploaded successfully!',data : image,err : false});
    // } catch (error) {
    //     console.error('Error uploading image:', error);
    //     res.status(500).send({err : true,msg : 'Error uploading image',data : null} );
    // }
});

appRouter.get('/image', async (req, res) => {
    const id = req.query.id;
    try {
        const image = await Image.findOne({_id : id});
        if (!image) {
            return res.status(404).send('Image not found');
        }
        const projectDirectory = path.join(__dirname, '../..'); 
        const relativeFilePath = path.join(projectDirectory, image.path);
        res.sendFile(relativeFilePath);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).send('Error retrieving image');
    }
});

appRouter.get('/',(req : express.Request,res : express.Response) => {
    res.status(200).json({Status : "Server is Up and running good!!"})
})