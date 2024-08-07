import Component from './Component';

export default function Home() {

  const getImage = async () =>{
    'use server';
    var fs = require('fs');
    const path = require('path');
    const filePath = path.resolve(__dirname, '2024-07-30-102827.jpg');
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