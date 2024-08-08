import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { image, filename } = await req.json();

    // Decode base64 string
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    const filePath = path.join(__dirname, filename);

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
      }
    });
    return NextResponse.json({ message: 'Image saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}