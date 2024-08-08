"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import { Loader2, ChevronRight, Terminal, } from "lucide-react"
import { useEffect, useState, useRef } from 'react';
import {Alert, AlertDescription, AlertTitle,} from "@/components/ui/alert"

const API_KEY = ""

interface ComponentProps {
  getImage: () => Promise<string>;
}

const Component = ({ getImage}: ComponentProps) => {
  const [photoSrc, setPhotoSrc] = useState('');
  const [data, setData] = useState('');
  const [tryAgain, setTryAgain] = useState('Detect more trash');
  const [loading, setLoading] = useState(false);
  const [generateAnswer, setGenerateAnswer] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureRef = useRef<HTMLButtonElement>(null);


  // Setup GenAI-model
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


  useEffect(() => {
    const width = 640;
    let height = 0;
    let streaming = false;
    let stream: MediaStream | null = null;

    const video = videoRef.current;
    const capture = captureRef.current;

    const startVideoStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      } catch (err) {
        console.error(`An error with the video stream occurred: ${err}`);
      }
    };

    if (video && capture) {
      const handleCanPlay = () => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);
          video.setAttribute('width', `${width}`);
          video.setAttribute('height', `${height}`);
          if (canvasRef.current) {
            canvasRef.current.setAttribute('width', `${width}`);
            canvasRef.current.setAttribute('height', `${height}`);
          }
          streaming = true;
        }
      };

      const handleCaptureClick = (ev: MouseEvent) => {
        ev.preventDefault();
        takePicture();
      };

      const takePicture = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context?.drawImage(video, 0, 0, width, height);
            const data = canvas.toDataURL('image/jpeg');
            setPhotoSrc(data);
          }
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      };

      if (!photoSrc) {
        startVideoStream();
        video?.addEventListener('canplay', handleCanPlay);
        capture?.addEventListener('click', handleCaptureClick);
      }

      // Cleanup function to remove event listeners
      return () => {
        video?.removeEventListener('canplay', handleCanPlay);
        capture?.removeEventListener('click', handleCaptureClick);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [photoSrc]);

  useEffect( () => {
    const prepareforAI = async () => {
      await saveImage(photoSrc);
      askai()
    }

    if (photoSrc && generateAnswer) {
      prepareforAI();
    }

  }, [photoSrc, generateAnswer]);

  const saveImage = async (base64Image: string) => {
    try {
      const response = await fetch('/api/saveImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          filename: 'saved_image.jpg',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save image');
      }
  
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const base64ToGenerativePart = (base64String: string, mimeType: string)  => {    
    return {
      inlineData: {
        data: base64String,
        mimeType: mimeType,
      },
    };
  }

  const acceptPhoto = async () => {
    setGenerateAnswer(true);
    setLoading(true);
  };

  const setBackToDefault = async () => {
    setGenerateAnswer(false);
    setPhotoSrc('');
    setData('');
    setTryAgain('Detect more trash');
  };

  const denyPhoto = () => {
    const canvas = document.getElementById('canvasRef') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height); // Adjust the width and height as needed
    setPhotoSrc('');
    setGenerateAnswer(false);
  };

  const askai = async () =>{
    var encodedImage = await getImage();
    const prompt = "Type the name of the trash shown in the picture and end the statement with a '.'. If there is not trash shown, please type 'no trash.'." +
    "If there is trash, type what materials the trash most probably consists of  in a second sentence. If you are not sure, please type 'I am not sure'.";
    const imagePart = base64ToGenerativePart(encodedImage, 'image/jpeg');
    const result = await model.generateContent([prompt, imagePart])
    const text = result.response.text();
    console.log("Response of AI:", text);
    setData(text);
    setLoading(false);
  }

  const formatData = (data: string) => {
    const splitData = data.split(".");
    if (splitData[0] === "no trash") {
      return (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>We could not detect any trash!</AlertTitle>
          <AlertDescription>
            Unfortunately we could not detect any trash in the picture. This could be, because in our eyes the item does not belong to the trash bin or the picture is not clear enough. Please try again to detect more trash.
          </AlertDescription>
        </Alert>
      )
    } else {
      return (
        <div className="text-result">
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            {splitData[0]}
          </h2>
          <p>
            {splitData[1]}
          </p>
        </div>
      )
    }
  }


  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="w-full h-auto rounded-full"
          src="/icon_generatedai.webp"
          alt="Icon"
          width={120}
          height={120}
          priority
        />
      </div>

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-6">
        Waste it right
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        With the help of AI, we can help you identify the type of trash you have and suggest ways to recycle it. 
        Take a picture of the trash and let us do the rest.
      </p>

      <div className="content flex flex-col items-center justify-between mt-6">
        <div className="camera-output-container relative w-[320px] h-[240px] flex flex-col items-center justify-center">
          <div className="media-container relative flex justify-center w-full h-full">
            {!photoSrc && (
              <video ref={videoRef} id="video" className="w-auto h-auto max-w-full max-h-full">Stream not available.</video>
            )}
            {photoSrc && (
              <img ref={photoRef} id="photo" src={photoSrc} alt="Captured" className="w-auto h-auto max-w-full max-h-full" />
            )}
          </div>
        </div>
        <div className="button-container flex justify-center mt-4 w-full mt-6">
          {!photoSrc && (
            <Button ref={captureRef} id="capture">Take Image</Button>
          )}
          {photoSrc &&!generateAnswer && (
            <div className="flex justify-between w-auto">
              <Button onClick={acceptPhoto} className="mx-16">Accept</Button>
              <Button variant={"destructive"} onClick={denyPhoto} className="mx-16">Delete</Button>
            </div>
          )}
        </div>

        {generateAnswer && (
          <div className="flex flex-col items-center">
            {loading && 
              <Button disabled className="mt-6">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading ...
              </Button>
            }
            {!loading && (
              <div className="results">
                {data && (
                  formatData(data)
                )}
                <div className="button-new-picture flex justify-center mt-4 w-full mt-6">
                  <Button variant="outline" onClick={setBackToDefault}>
                    Detect more Trash
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
  
        )}
        
        <canvas ref={canvasRef} id="canvas" style={{ display: 'none' }} />
      </div>

    </main>
  );
};

export default Component;