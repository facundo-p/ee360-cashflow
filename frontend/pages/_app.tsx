import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  const [authKey, setAuthKey] = useState(0);

  const handleAuthReset = () => {
    console.log('handleAuthReset. Key:', authKey);
    setAuthKey(k => k + 1);
    console.log('handleAuthReset. New key:', authKey);
  };

  return (
    <AuthProvider key={authKey} onAuthReset={handleAuthReset}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
