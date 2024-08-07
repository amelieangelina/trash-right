"use client";

import { minify } from "next/dist/build/swc";
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';



const Component = ({getImage}: {getImage: () => Promise<string>}) => {
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [photoSrc, setPhotoSrc] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [generateAnswer, setGenerateAnswer] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureRef = useRef<HTMLButtonElement>(null);


  // Setup GenAI-model
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(api_key);
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
        console.error(`An error occurred: ${err}`);
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
        console.log("IN TAKE PICTURE");
        if (canvas) {
          const context = canvas.getContext('2d');
          if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context?.drawImage(video, 0, 0, width, height);
            const data = canvas.toDataURL('image/jpeg');
            setPhotoSrc(data);
            setIsPhotoTaken(true);
          }
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        }
      };

      if (!isPhotoTaken) {
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
  }, [isPhotoTaken]);

  useEffect( () => {
    if (photoSrc && generateAnswer) {
      const image = base64ToGenerativePart(photoSrc, 'image/png');
      // Check the type
      if (photoSrc.startsWith('data:image/png;base64,')) {
        console.log('The data is a png image.');
      } else {
        console.log('The data is not a png image.');
      }
      askai();
      console.log("ASKAI");
      setGenerateAnswer(false);
      setDisplayAnswer(true);
    }
  }, [photoSrc, generateAnswer]);

  const base64ToGenerativePart = (base64String, mimeType) => {
    console.log("this is the STRING:", base64String)
    
    return {
      inlineData: {
        data: base64String,
        mimeType: mimeType,
      },
    };
  }

  const acceptPhoto = async () => {
    setGenerateAnswer(true);
  };

  const denyPhoto = () => {
    const canvas = document.getElementById('canvasRef') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height); // Adjust the width and height as needed
    setPhotoSrc('');
    setIsPhotoTaken(false);
    setDisplayAnswer(false);
  };

  const askai = async () =>{
    var encodedImage = await getImage();
    const prompt = "What kind of trash is displayed in the picture. Describe the trash and suggest ways to recycle it.";
    const imagePart = base64ToGenerativePart(encodedImage, 'image/jpeg');
    const result = await model.generateContent([prompt, imagePart])
    console.log(result.response.text());
    const text = result.response.text();
    console.log(text);
    setData(text);
    setLoading(false);
    setDisplayAnswer(true);
  }

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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

      <div className="content flex flex-col items-center justify-center">
        <div className="camera-output-container relative w-[640px] h-[480px] flex flex-col items-center justify-center">
          {!isPhotoTaken && (
            <>
              <video ref={videoRef} id="video" className="w-full h-auto">Stream not available.</video>
              <button ref={captureRef} id="capture" className="mt-4">Capture Image</button>
            </>
          )}
          {isPhotoTaken && (
            <div className="flex flex-col items-center">
              <img ref={photoRef} id="photo" src={photoSrc} alt="Captured" className="w-full h-auto" />
              <div className="button-container flex justify-between mt-4 w-full">
                <button onClick={acceptPhoto} className="mx-2">Accept</button>
                <button onClick={denyPhoto} className="mx-2">Deny</button>
              </div>
            </div>
          )}
          {displayAnswer && (
            <div className="flex flex-col items-center">
              <h1>Google Tryout</h1>
              {loading && <p>Loading...</p>}
              {error && <p>Error: {error.message}</p>}
              {data && <pre>{data}</pre
              >}
            </div>
          )}
        </div>
        <canvas ref={canvasRef} id="canvas" style={{ display: 'none' }} />
      </div>


      <div className="flex justify-center items-center">
          {/* TODO: replace page */}
          <Link
            href="/tryserver"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
            replace={true}
          >
            <h2 className="mb-3 text-2xl font-semibold">
              TryServer{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
            For trying the server            </p>
          </Link>
      </div>
      
      <div className="flex justify-center items-center">
          {/* TODO: replace page */}
          <Link
            href="/landing"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
            replace={true}
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Landing Page{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Original landing page of Nextjs to find templates and documentation.
            </p>
          </Link>
      </div>

    </main>
  );
};

export default Component;