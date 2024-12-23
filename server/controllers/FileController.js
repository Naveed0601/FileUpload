const { Storage } = require('@google-cloud/storage');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const fs = require('fs');
const path = require('path');
require('dotenv').config();


// const secretClient = new SecretManagerServiceClient({
//   keyFilename: process.env.KEYFILENAME
// });


const storage = new Storage({ 
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEYFILENAME,
});

const bucketName = process.env.BUCKET_NAME;


const FileUpload = async(req ,res) => {
    const { bucketName, fileOutputName } = req.body;
    console.log(req.body);
    if (!req.file || !bucketName || !fileOutputName) {
        return res.status(400).send({ error: 'Invalid request data.' });
    }

    try {
        // console.log(storage)
        const bucket = storage.bucket(bucketName);
        // console.log(bucket)
        await bucket.upload(req.file.path, { destination: fileOutputName });
        res.status(200).send({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send({ error: 'Failed to upload file' });
    }
}

const GetFiles = async (req , res) => {
    try {
        // console.log(req);
        const [files] = await storage.bucket(bucketName).getFiles();
        const fileNames = files.map(file => file.name);
        res.json(fileNames);
      } catch (err) {
        res.status(500).send('Error listing files');
      }
}

const DownloadFile = async (req, res) => {
    const fileName = req.params.fileName;
    const destFilename = path.join(__dirname, "downloads", fileName);
  
    try {
      const downloadDir = path.dirname(destFilename);
      const file = storage.bucket(bucketName).file(fileName);
    
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).send("File not found");
    }

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    file.createReadStream().pipe(res).on('finish', () => {
      console.log(`File ${fileName} successfully sent to client.`);
    }).on('error', (err) => {
      console.error("Error streaming file:", err);
      return res.status(500).send("Error downloading file");
    });
    } catch (err) {
      console.error("Error downloading file:", err);
      return res.status(500).send("Error downloading file");
    }
};

// Initialize the Secret Manager client
const secretClient = new SecretManagerServiceClient({
  keyFilename: process.env.KEYFILENAME,  
});

const SecretKey = async(req , res) => {
  const secretName = process.env.SECRETNAME;
  const projectId = process.env.MAIN_ID;  // Get project ID from environment variable
  const secretPath = `projects/${projectId}/secrets/${secretName}/versions/latest`;

  // For debugging purposes, log the path to ensure it’s being constructed correctly
  // console.log('Fetching secret from:', secretPath , projectId);

  try {
    // Access the secret
    const [accessResponse] = await secretClient.accessSecretVersion({
      name: secretPath,
    });
    
    // console.log( "Access Response" , accessResponse);
    // Extract secret data and log it
    const secretData = accessResponse.payload.data.toString('utf8');
    // console.log('Fetched secret data:', secretData);

    // Return the secret data (or use it as needed)
    res.status(200).json(secretData)
  } catch (err) {
    console.error(`Error accessing secret: ${err.message}`);
  }
}

const GetOneFile = async (req, res) => {
  const filename = req.params.filename;
  if (!filename) {
    return res.status(400).send('Filename is required');
  }

  try {
    // Reference to the specific file in the bucket
    const file = storage.bucket(bucketName).file(filename);

    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).send('File not found');
    }

    // Retrieve metadata or download file content
    const [metadata] = await file.getMetadata();
    res.json(metadata); // Respond with file metadata
  } catch (error) {
    console.error('Error retrieving file:', error.message);
    res.status(500).send('Error retrieving file');
  }
};




module.exports = {FileUpload , GetFiles , DownloadFile , SecretKey , GetOneFile};