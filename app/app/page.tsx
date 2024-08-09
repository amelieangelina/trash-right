import Component from './Component';
import fs from 'fs';
import path from 'path';

export default function Home() {

  const getImage = async () =>{
    'use server';
    const filePath = path.resolve(__dirname, 'api', 'saveImage', 'saved_image.jpg');
    var imageFile = fs.readFileSync(filePath);
    var encoded = Buffer.from(imageFile).toString('base64');
    return encoded;
  }
  
  return (
    <div>
      <Component getImage={getImage} />
    </div>
  );
}