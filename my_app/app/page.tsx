"use client"; // Add this line

import Image from "next/image";
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const width = 640;
    let height = 0;
    let streaming = false;
    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const photo = document.getElementById('photo') as HTMLImageElement;
    const capture = document.getElementById('capture') as HTMLButtonElement;

    // communicates with the user camera and can work with smartphones and webcams
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    video.addEventListener('canplay', () => {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);
        video.setAttribute('width', `${width}`);
        video.setAttribute('height', `${height}`);
        canvas.setAttribute('width', `${width}`);
        canvas.setAttribute('height', `${height}`);
        streaming = true;
      }
    });

    capture.addEventListener('click', (ev) => {
      ev.preventDefault();
      takePicture();
    });

    const takePicture = () => {
      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context?.drawImage(video, 0, 0, width, height);
        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
      } else {
        clearPhoto();
      }
    };

    const clearPhoto = () => {
      const context = canvas.getContext('2d');
      context?.fillRect(0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    };

    clearPhoto();
  }, []);

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
          <video id="video">Stream not available.</video>
          <button id="capture">Take photo</button>
        </div>
        <canvas id="canvas"></canvas>
        <div className="output">
          <img id="photo"/>
        </div>
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
