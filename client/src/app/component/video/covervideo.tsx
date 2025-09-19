'use client';
import { useRef, useState, useEffect } from 'react';

type VideoPlayerProps = {
  src: string;
};

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, ] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch((err) => console.error('Autoplay failed:', err));
    }
  }, [isMuted]);
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        borderRadius: '20px',
        margin: '0 auto',
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
    </div>
  );
}
