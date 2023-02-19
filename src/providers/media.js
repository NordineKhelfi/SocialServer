
import path from "path";
import { createWriteStream , unlink} from "fs";

const uploadFiles = async (mediaFiles, directory) => {

    var paths = [];
    // loop over the media files 
    for (let index = 0; index < mediaFiles.length; index++) {


        // extract name and the read stream 
        const { filename, createReadStream } = await mediaFiles[index];

        // create the read stream and generate new unique name for the file
        var readStream = createReadStream();
        var newFilename = `${index}-${new Date().getTime().toString()}${path.parse(filename).ext}`;

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
    return paths;
}


const deleteFiles = async (files) => {
    
    
    for(let index = 0 ; index < files.length ; index++) { 
        await new Promise((resolve , reject) => { 

           
            unlink(files[index] , (error) => {
                
                resolve() ; 
            })
        }) 
    } ; 



}


export {
    uploadFiles , 
    deleteFiles
}