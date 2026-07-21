"use client";
import React, { useState, useEffect } from 'react';

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function ProfileSlider({ profiles, title }: { profiles: any[], title?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else {
        setCardsToShow(2);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCards = profiles.length;
  const maxIndex = Math.max(0, totalCards - cardsToShow);

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <div style={{ marginTop: '40px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
        <h3 className="dyn-sec-title" style={{ margin: 0, marginTop: '40px' }}>{title || "Featured Video Profiles"}</h3>
        
        {totalCards > cardsToShow && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              style={{
                background: currentIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(249,115,22,0.1)',
                color: currentIndex === 0 ? 'rgba(255,255,255,0.3)' : '#f97316',
                border: '1px solid',
                borderColor: currentIndex === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(249,115,22,0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label="Previous Slide"
            >
              <IconArrowLeft />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
              style={{
                background: currentIndex === maxIndex ? 'rgba(255,255,255,0.05)' : 'rgba(249,115,22,0.1)',
                color: currentIndex === maxIndex ? 'rgba(255,255,255,0.3)' : '#f97316',
                border: '1px solid',
                borderColor: currentIndex === maxIndex ? 'rgba(255,255,255,0.05)' : 'rgba(249,115,22,0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label="Next Slide"
            >
              <IconArrowRight />
            </button>
          </div>
        )}
      </div>

      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div 
          style={{ 
            display: 'flex', 
            gap: '20px', 
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(calc(-${currentIndex * (100 / cardsToShow)}% - ${currentIndex * (20 / cardsToShow)}px))`
          }}
        >
          {profiles.map((prof: any, idx: number) => (
            <div 
              key={idx} 
              className="dyn-video-card"
              style={{
                minWidth: `calc(${100 / cardsToShow}% - ${(20 * (cardsToShow - 1)) / cardsToShow}px)`,
                maxWidth: `calc(${100 / cardsToShow}% - ${(20 * (cardsToShow - 1)) / cardsToShow}px)`,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '22px',
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}
            >
              <h5>{prof.name}</h5>
              <p>{prof.designation}</p>
              <span className="dyn-video-desc">{prof.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
