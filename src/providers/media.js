
import path from "path";
import { createWriteStream, unlink } from "fs";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dmuedqhmz',
    api_key: '448345525547775',
    api_secret: 'Ycm-gJH06J6GXz6oHMveQUk7UOE'
});

const uploadFiles = async (mediaFiles, directory, uploadToCloud) => {

    let paths = [];
    let tags = [];

    // loop over the media files 
    for (let index = 0; index < mediaFiles.length; index++) {
        // extract name and the read stream 
        const { filename, createReadStream } = await mediaFiles[index];

        // create the read stream and generate new unique name for the file
        var readStream = createReadStream();
        var newFilename = `${index}-${new Date().getTime().toString()}${path.parse(filename).ext}`

        // create the distination path 
        // and open a write stream to it so we can copy the image 
        var distPath = path.join(directory, newFilename);
        var writeStream = createWriteStream(distPath);

        // copy the read stream to the write stream chunk by chunk 
        let stream = readStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            stream.on("finish", async function () {
                resolve();
            });
        });

        paths.push(distPath)
    }

    if (uploadToCloud) {
        for (let index = 0; index < paths.length; index++) {
            const path = paths[index];
            let uploadResponse;

            if (directory.endsWith('videos')) {
                uploadResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_large(path, { resource_type: 'video' }, (error, result) => {
                        if (error) return reject(error);
                        return resolve(result);
                    });
                });

                uploadResponse.url = uploadResponse.url.replace('/upload', '/upload/q_auto:low');
            }
            else {
                uploadResponse = await cloudinary.uploader.upload(path, {
                    categorization: "aws_rek_tagging",
                    auto_tagging: 0.7
                });
            }

            paths[index] = uploadResponse.url;
            if (uploadResponse.tags) tags.push(...uploadResponse.tags);
        }
    }

    return { paths, tags: [...new Set(tags)] };
}


const deleteFiles = async (files) => {
    for (let index = 0; index < files.length; index++) {
        await new Promise((resolve, reject) => {
            unlink(files[index], (error) => {
                resolve();
            })
        })
    };
}


export {
    uploadFiles,
    deleteFiles,
}