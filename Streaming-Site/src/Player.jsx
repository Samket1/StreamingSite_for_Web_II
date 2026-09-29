import React, { useState, useEffect } from 'react';
import { ArrowLeft, Server } from 'lucide-react';

export default function Player({ movie, onBack }) {
  const [videoSource, setVideoSource] = useState('coca-cola');

  if (!movie) return null;

  const movieId = movie.id || movie.movieId;

  let embedUrl = "";
  if (videoSource === 'coca-cola') {
    embedUrl = `https://www.vidsrc.com/embed/movie/${movieId}`; // Modify these to your real URLs!
  } else if (videoSource === 'pepsi') {
    embedUrl = `https://www.pepsi.com/embed/movie/${movieId}`;
  } else if (videoSource === 'sprite') {
    embedUrl = `https://www.sprite.com/embed/${movieId}`;
  }

  useEffect(() => {
    // Hide scrolling on the main body when player is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column'
    }}>
      {/* Player Controls Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '15px 20px',
        backgroundColor: '#0b0c10', alignItems: 'center', borderBottom: '1px solid #1f2833'
      }}>
        
        {/* Back Button & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={onBack}
            style={{
              background: 'transparent', border: 'none', color: '#4ade80', 
              cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <ArrowLeft size={28} />
          </button>
          <h2 style={{ color: 'white', fontSize: '18px', margin: 0 }}>
            {movie.title || movie.name}
          </h2>
        </div>

        {/* Server Selection Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Server size={18} color="#4ade80" />
          <select 
            value={videoSource} 
            onChange={(e) => setVideoSource(e.target.value)}
            style={{
              backgroundColor: '#1f2833', color: 'white', padding: '8px 12px', 
              borderRadius: '5px', border: '1px solid #4ade80', outline: 'none',
              cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            <option value="coca-cola">VidSrc (Main)</option>
            <option value="pepsi">MoviesAPI (Backup)</option>
            <option value="sprite">2Embed (Fast)</option>
          </select>
        </div>
      </div>

      {/* IFRAME VIDEO PLAYER */}
      <div style={{ flex: 1, backgroundColor: '#000' }}>
        <iframe 
          src={embedUrl}
          width="100%" 
          height="100%" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        ></iframe>
      </div>
    </div>
  );
}
