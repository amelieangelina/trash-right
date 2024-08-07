import Component from './Component';

export default function Home() {
  const data = null;
  const loading = false;

  const getImage = async () =>{
    'use server';
    const prompt = "What kind of trash is displayed in the picture. Describe the trash and suggest ways to recycle it.";
    var fs = require('fs');
    const path = require('path');
    const filePath = path.resolve(__dirname, '2024-07-30-102827.jpg');
    var imageFile = fs.readFileSync(filePath);
    var encoded = Buffer.from(imageFile).toString('base64');
    console.log("ENCODED:",encoded);
    return encoded;

    // const text = response.text();
    // console.log(text);
    // setData(text);
    // setLoading(false);
    // setDisplayAnswer(true);
  }
  
  return (
    <div>
      <Component getImage={getImage} />
    </div>
  );
}