'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

type VideoPlayerProps = {
  src: string;
};

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch((err) => console.error('Autoplay failed:', err));
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        paddingBottom: '30px',
        paddingTop: '30px',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '20px',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <button
          onClick={toggleMute}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <Image
            src={isMuted ? '/icons/mute.png' : '/icons/unmute.png'}
            alt="Mute Toggle"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
