"use client"; // Add this line

import Image from "next/image";
import Link from 'next/link';
import { useEffect,  useState, useRef } from 'react';

export default function Home() {

  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [photoSrc, setPhotoSrc] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const width = 640;
    let height = 0;
    let streaming = false;

    const video = videoRef.current;
    const capture = captureRef.current;

    if (video && capture) {
      // Communicates with the user camera and works with smartphones and webcams
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });

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

            const data = canvas.toDataURL('image/png');
            if (photoRef.current) {
              photoRef.current.setAttribute('src', data);
            }
            setIsPhotoTaken(true);
          }
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      capture.addEventListener('click', handleCaptureClick);

      // Cleanup function to remove event listeners
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        capture.removeEventListener('click', handleCaptureClick);
      };
    }
  }, []);

  const acceptPhoto = () => {
    setIsPhotoTaken(false);
    const photoRef = document.getElementById('photoRef') as HTMLImageElement;
  };

  const denyPhoto = () => {
    const canvas = document.getElementById('canvasRef') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height); // Adjust the width and height as needed
    setPhotoSrc('');
    setIsPhotoTaken(false);
  };


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

      <div className="content">
        <div className="camera">
          <video ref={videoRef} id="video">Stream not available.</video>
          <button ref={captureRef} id="capture">Capture Image</button>
        </div>
        <div className="output">
            <canvas ref={canvasRef} id="canvas"/>
            <div className="relative">
              <img ref={photoRef} id="photo" alt="Captured" />
              <div className="button-container flex justify-between">
                <button onClick={acceptPhoto}>Accept</button>
                <button onClick={denyPhoto}>Deny</button>
                <span>{isPhotoTaken ? 'Photo Taken' : 'No Photo'}</span>
              </div>
            </div>
        </div>
      </div>
      <div className="content2">
        {isPhotoTaken ? (
          'Photo taken'
          ) :
          (
          'Photo not taken'
        )
        }
      </div>
      

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* TODO: replace page  */}
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
}
