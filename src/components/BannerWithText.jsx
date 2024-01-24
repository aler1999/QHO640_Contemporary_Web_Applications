import React from 'react';
import Image from 'react-bootstrap/Image';

function BannerWithText({imageUrl, title, description}) {
  return (
    <div style={{ position: 'relative', height: '350px', overflow: 'hidden' }}>
      <Image
        src={imageUrl}
        className="img-fluid"
        alt="Responsive image"
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
      <div 
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          color: 'white', 
          textShadow: '2px 2px 4px rgba(0, 0, 0, 1)'
        }}
      >
        <h2 style={{ fontSize: '40px', fontWeight: 'bold' }}>
          {title}
        </h2>
        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{description}</p>
      </div>
    </div>
  )
}

export default BannerWithText;