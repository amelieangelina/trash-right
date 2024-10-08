"use client";

import Image from "next/image";
import * as React from "react";
import {Button} from "@/components/ui/button";
import { Loader2, ChevronRight, Terminal, AlertCircle, } from "lucide-react"
import { useEffect, useState, useRef } from 'react';
import {Alert, AlertDescription, AlertTitle,} from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select"


interface ComponentProps {
  getImage: () => Promise<string>;
  api_key: any;
}

const Component = ({ getImage, api_key}: ComponentProps) => {
  const [photoSrc, setPhotoSrc] = useState('');
  const [data, setData] = useState(['']);
  const [betterWay, setBetterWay] = useState('');
  const [noRecycling, setNoRecycling] = useState('');
  const [country, setCountry] = useState('');
  const [textToSpeak, setTextToSpeak] = useState('');
  const [loading, setLoading] = useState(false);
  const [generateAnswer, setGenerateAnswer] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureRef = useRef<HTMLButtonElement>(null);
  var myTimeout:  NodeJS.Timeout;

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

  const selectCountry = () => {
    return (
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select your Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Countries</SelectLabel>
            <SelectItem value="Argentina">Argentina</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Austria">Austria</SelectItem>
            <SelectItem value="Bangladesh">Bangladesh</SelectItem>
            <SelectItem value="Belgium">Belgium</SelectItem>
            <SelectItem value="Brazil">Brazil</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Chile">Chile</SelectItem>
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="Colombia">Colombia</SelectItem>
            <SelectItem value="Czech Republic">Czech Republic</SelectItem>
            <SelectItem value="Denmark">Denmark</SelectItem>
            <SelectItem value="Egypt">Egypt</SelectItem>
            <SelectItem value="Finland">Finland</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="Greece">Greece</SelectItem>
            <SelectItem value="Hungary">Hungary</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Indonesia">Indonesia</SelectItem>
            <SelectItem value="Iran">Iran</SelectItem>
            <SelectItem value="Ireland">Ireland</SelectItem>
            <SelectItem value="Israel">Israel</SelectItem>
            <SelectItem value="Italy">Italy</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
            <SelectItem value="Mexico">Mexico</SelectItem>
            <SelectItem value="Netherlands">Netherlands</SelectItem>
            <SelectItem value="New Zealand">New Zealand</SelectItem>
            <SelectItem value="Nigeria">Nigeria</SelectItem>
            <SelectItem value="Norway">Norway</SelectItem>
            <SelectItem value="Pakistan">Pakistan</SelectItem>
            <SelectItem value="Peru">Peru</SelectItem>
            <SelectItem value="Philippines">Philippines</SelectItem>
            <SelectItem value="Poland">Poland</SelectItem>
            <SelectItem value="Portugal">Portugal</SelectItem>
            <SelectItem value="Qatar">Qatar</SelectItem>
            <SelectItem value="Romania">Romania</SelectItem>
            <SelectItem value="Russia">Russia</SelectItem>
            <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
            <SelectItem value="Singapore">Singapore</SelectItem>
            <SelectItem value="South Africa">South Africa</SelectItem>
            <SelectItem value="South Korea">South Korea</SelectItem>
            <SelectItem value="Spain">Spain</SelectItem>
            <SelectItem value="Sweden">Sweden</SelectItem>
            <SelectItem value="Switzerland">Switzerland</SelectItem>
            <SelectItem value="Thailand">Thailand</SelectItem>
            <SelectItem value="Turkey">Turkey</SelectItem>
            <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Vietnam">Vietnam</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

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
    setData(['']);
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
    console.log("Country" + country.toString());
    const prompt = "Type the name of the recycable object shown in the picture and end the statement with a '.'. If there is no recycable object shown, please type 'no trash.'." +
    "In 1 sentence, type what materials the trash most probably consists of. In one sentence tell me how many years this exact object will take to decompose in numbers."+
    "In 1 sentence tell me how i can properly dispose this trash in "+ country.toString() + "."+
    "In 1 sentence tell me where this trash will end up in the best case scenario. In 1 sentences tell me where the trash will end up in the worst case scenario.";
    const imagePart = base64ToGenerativePart(encodedImage, 'image/jpeg');
    const result = await model.generateContent([prompt, imagePart])
    const text = result.response.text();
    const splitData = text.split(".");
    const prompt2 = "In a few sentences give me hacks on how to reduce waste of " + splitData[0] + " in "+ country.toString() +"? Type the answer in continious text.";
    const result2 = await model.generateContent(prompt2);
    setBetterWay(result2.response.text());
    const prompt3 = "In a few sentences elaborate on what impact the materials:" + splitData[1] + " used in "+ splitData[0] + "can have on the environment, when not being recycled in "+ country.toString() + " ? What exaclty are the negative impacts on the environment? Type the answer in a continous text.";
    const result3 = await model.generateContent(prompt3);
    setNoRecycling(result3.response.text());
    setData(splitData);
    setLoading(false);
    if (isSwitchOn) {
      speakText(splitData);
    }
  }

  const createTextforSpeech = (data: any) => {
    if (data[0] === "no trash") {
      return ( "Unfortunately we could not detect any trash in the picture. This could be, because in our eyes the item does not belong to the trash bin or the picture is not clear enough. Please try again to detect more trash.");
    } else {
      const text = "We detected " + data[0] + "." + "Which materials does it consist of?" + data[1] + "." + data[2] + "."+
      "How can you properly dispose this trash?" + data[3] + "."+
      "Where will it end up?" + data[4] + "." + data[5] + "."+
      "Is there hacks to avoid this kind of trash?"+ "."+ betterWay.toString() + "."+
      "What is the impact on the environment?"+  "."+ noRecycling.toString() + ".";
      console.log("Text to speak: " + text);  
      return text;
    }
  }  
  
  function myTimer() {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
      myTimeout = setTimeout(myTimer, 10000);
  }

  const speakText = (data:any) => {
    const text = createTextforSpeech(data);
    window.speechSynthesis.cancel();
    myTimeout = setTimeout(myTimer, 10000);
    var toSpeak = text;
    var utt = new SpeechSynthesisUtterance(toSpeak);
    utt.onend =  function() { clearTimeout(myTimeout); }
    window.speechSynthesis.speak(utt);
  }

  const formatData = (data: any) => {
    if (data[0] === "no trash") {
      return (
        <Alert className="max-w-[700px]">
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
            {data[0]}
          </h2>
          <Accordion type="single" className="w-[700px]">
            <AccordionItem value="item-1">
              <AccordionTrigger>Which materials does it consist of?</AccordionTrigger>
              <AccordionContent>
                {data[1]}.{data[2]}.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How can you properly dispose this trash?</AccordionTrigger>
              <AccordionContent>
              {data[3]}.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Where will it end up?</AccordionTrigger>
              <AccordionContent>
                {data[4]}.{data[5]}.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is there hacks to avoid this kind of trash?</AccordionTrigger>
              <AccordionContent>
                {betterWay}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What is the impact on the environment?</AccordionTrigger>
              <AccordionContent>
                {noRecycling}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )
    }
  }
  const handleChange = (value:string) => {
    setCountry(value);
    console.log({country})
  };


  const handleAssistant = (value:string) => {
    if (value === "reading-assistant") {
      setIsSwitchOn(true);
      console.log("Assistant turned on")
    } else if (value === "no-assistant") {
      setIsSwitchOn(false);
      console.log("Assistant turned off")
    }
  };

  const switchtoSpeech = () => {
    return (
      <Select onValueChange={handleAssistant}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select an Assistant" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select an Assistant</SelectLabel>
            <SelectItem value="reading-assistant">Reading Assistant</SelectItem>
            <SelectItem value="no-assistant">No Assistant</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }


  return (
    <main className="flex flex-col items-center justify-between p-12">
      <div className="flex flex-col items-center justify-between w-[700px]">
        <div className="ml-auto">
          {selectCountry()}
        </div>
        <div className="ml-auto mt-2">
          {switchtoSpeech()}
        </div>
      </div>
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] mt-4">
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
        TrashRight
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-[700px] text-justify">
      TrashRight is an innovative application that leverages artificial intelligence to promote environmental awareness and sustainability. The app allows users to take a picture of any trash item, which is then analyzed using the Gemini API to accurately identify the type of waste. TrashRight provides detailed information about the item, including its environmental impact, recycling instructions, and proper disposal methods. By empowering individuals with knowledge about waste management, TrashRight aims to reduce environmental pollution and contribute to a cleaner, more sustainable future.
      </p>
      {!country && (
        <Alert variant="destructive" className="max-w-[700px] mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No country selected</AlertTitle>
          <AlertDescription>
            Please select your country, so that we can adapt the information to your needs.
          </AlertDescription>
        </Alert>
      )}
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