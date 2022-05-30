import React from 'react';
import HelloWorld from '../components/hello-world';
import exampleSar from '../lib/examplesar.json';

export default function Home(props) {
  return (
    <div>
      <HelloWorld sar={exampleSar} />
    </div>
  );
}
