import React from 'react';

const Footer = () => {
  const { 
    copyrightYear,
    companyName,
    productVersion
  } = window.ENV
  return (
    <footer
      style={{
        zIndex: 1,
        position: 'absolute',
        bottom: '10px',
        color: '#ccc',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        paddingLeft: 20
      }}
    >
      Copyright © {copyrightYear} {companyName} All rights reserved | {productVersion}
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0
        }}
      >
        <a
          href="http://www.freepik.com"
          style={{
            textDecoration: 'none',
            color: 'rgba(0, 135, 86, 0.5)',
            fontSize: '10px'
          }}
        >
          Designed by Freepik
        </a>
      </div>
    </footer>
  );
};

export default Footer;
