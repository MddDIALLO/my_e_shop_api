import { Request, Response } from 'express';
import * as path from 'path';
const fs = require('fs');

// const storeImage = (req: Request, res: Response) => {
//   const { imageData, uploadPath, fileName } = req.body;
//   const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
//   const filePath = path.join(__dirname, '..', 'public', uploadPath, fileName);

//   const directoryPath = path.dirname(filePath);

//   if (!fs.existsSync(directoryPath)) {
//     fs.mkdirSync(directoryPath, { recursive: true });
//   }

//   fs.writeFile(filePath, base64Data, 'base64', (err) => {
//     if (err) {
//       console.error('Error saving image:', err);
//       res.status(500).send('Error saving image');
//     } else {
//       res.status(200).send({
//         message: 'Image saved successfully',
//         filePath: filePath
//     });
//     }
//   });
// };

const storeImage = (req, res) => {
  const { imageData, uploadPath, fileName } = req.body;
  const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const filePath = path.join(__dirname, '..', 'public', uploadPath);
  const directoryPath = path.resolve(filePath);

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
    } else {
      files.forEach((file) => {
        if (file.startsWith(fileName)) {
          const currentFilePath = path.join(directoryPath, file);
          fs.unlinkSync(currentFilePath);
        }
      });

      const fullFilePath = path.join(filePath, fileName);
      fs.writeFile(fullFilePath, base64Data, 'base64', (writeErr) => {
        if (writeErr) {
          console.error('Error saving image:', writeErr);
          res.status(500).send('Error saving image');
        } else {
          res.status(200).send({
            message: 'Image saved successfully',
            filePath: fullFilePath,
          });
        }
      });
    }
  });
};

export default { storeImage };