'use client';

import React, { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CameraComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processAndUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadSuccess(false);

    try {
      // 1. Compress Image
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // 2. Add Watermark via Canvas
      const watermarkedBlob = await addWatermark(compressedFile);

      // 3. Upload to Supabase
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const { error } = await supabase.storage
        .from('gallery')
        .upload(fileName, watermarkedBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Upload failed:', error);
        alert('Failed to process film. Please try again.');
      } else {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000); // Hide toast after 3s
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const addWatermark = (file: File | Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Add Watermark Text
        const fontSize = Math.max(canvas.width * 0.03, 24); // Responsive font size
        ctx.font = `600 ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        // Text positioning
        const padding = canvas.width * 0.03;
        const textX = canvas.width - padding;
        const textY = canvas.height - padding;
        const lineSpacing = fontSize * 1.2;

        // Add shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        ctx.fillText('#AnchoredRealm', textX, textY - lineSpacing);
        ctx.fillText('11.10.2026', textX, textY);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          'image/jpeg',
          0.92 // High quality JPEG
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto relative perspective-1000">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={processAndUploadImage}
        className="hidden"
      />

      {/* 3D Skeuomorphic Camera Body */}
      <button
        onClick={handleCameraClick}
        disabled={isProcessing}
        className={`relative group flex items-center justify-center w-72 h-44 rounded-[2rem] transition-all duration-200
          bg-gradient-to-br from-[#d4a387] to-[#A35F39]
          shadow-[12px_12px_24px_rgba(0,0,0,0.15),-10px_-10px_20px_rgba(255,255,255,0.7),inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-4px_8px_rgba(0,0,0,0.2)]
          active:scale-[0.97] active:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.6),inset_0_6px_10px_rgba(0,0,0,0.15)]
          disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed`}
      >
        {/* Leather/Grip Texture Overlay */}
        <div className="absolute inset-2 rounded-[1.5rem] bg-[#C17F59] opacity-90 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/leather.png")' }}></div>

        {/* Viewfinder Element (Top Right) */}
        <div className="absolute top-4 right-6 w-12 h-7 bg-gray-900 rounded-md border-b-2 border-r-2 border-white/20 border-t-2 border-l-2 border-black/40 shadow-inner flex items-center justify-center overflow-hidden">
           <div className="w-10 h-5 bg-gradient-to-tr from-cyan-900/40 to-blue-300/30 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
        </div>

        {/* Fake Shutter Button (Top Left) */}
        <div className="absolute -top-3 left-8 w-10 h-4 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-lg shadow-sm border border-gray-400 group-active:translate-y-2 transition-transform duration-100"></div>

        {/* Main Camera Lens */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-800 to-black p-1 shadow-[10px_10px_20px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.2)] relative z-10 flex items-center justify-center border border-gray-700/50">
          {/* Inner Lens Rings */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tl from-gray-900 to-gray-700 p-2 shadow-inner flex items-center justify-center border-[0.5px] border-white/10">
             <div className="w-16 h-16 rounded-full bg-black shadow-[inset_0_5px_15px_rgba(0,0,0,1)] relative flex items-center justify-center">
                {/* Aperture / Sensor */}
                <div className="w-6 h-6 rounded-full bg-[#111] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] border border-white/5"></div>
                {/* Lens Flare Reflections */}
                <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-cyan-400/20 blur-[1px]"></div>
                <div className="absolute bottom-3 right-4 w-2 h-2 rounded-full bg-green-400/20 blur-[1px]"></div>
                <div className="absolute top-4 right-3 w-2 h-6 -rotate-45 bg-white/10 rounded-full blur-[2px]"></div>
             </div>
          </div>
        </div>

        <span className="sr-only">Take Photo</span>
      </button>

      {/* Pulsing Action Text */}
      <div className="mt-8 flex flex-col items-center justify-center space-y-2">
        <div className="animate-bounce">
           <svg className="w-5 h-5 text-[var(--color-terracotta)]/80" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
           </svg>
        </div>
        <p className="text-sm text-gray-800 font-extrabold tracking-[0.2em] uppercase animate-pulse drop-shadow-sm">
          Tap Camera to Capture
        </p>
      </div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
          <div className="bg-[#F9F8F6] px-8 py-6 rounded-2xl flex flex-col items-center shadow-2xl sepia-[0.4] border border-gray-300">
            <Loader2 className="w-12 h-12 text-[#C17F59] animate-spin mb-4 drop-shadow-md" />
            <p className="text-gray-900 font-bold tracking-widest uppercase text-sm">Developing Film...</p>
            <div className="w-32 h-1 bg-gray-200 mt-4 rounded-full overflow-hidden">
               <div className="h-full bg-[#C17F59] animate-[shimmer_1.5s_infinite] w-full origin-left"></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {uploadSuccess && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-[#F9F8F6] px-6 py-4 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border border-gray-700">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <span className="font-bold tracking-wide">Photo developed & added to gallery!</span>
        </div>
      )}
    </div>
  );
}
