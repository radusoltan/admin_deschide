import React from 'react';
import Head from 'next/head';

const Preview = ({ title, text, image }) => {
  return (
      <div>
        <Head>
          <title>{title}</title>
        </Head>
        <h1>{title}</h1>
        <img src={image} alt={title} />
        <p>{text}</p>
      </div>
  );
};

export default Preview;