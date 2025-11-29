import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRef, useState, useCallback } from 'react';

const Scene = dynamic(() => import('@/src/Scene'), { ssr: false });

export default function Home() {
  const canvasRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      // Capture at device pixel ratio
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'virtechz-logo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Virtechz ? 3D Logo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="3D logo concept for Virtechz" />
      </Head>
      <main className="container">
        <header className="header">
          <div className="brand">
            <span className="dot" />
            <h1>Virtechz</h1>
          </div>
          <div className="actions">
            <button className="btn" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exporting?' : 'Export PNG'}
            </button>
            <a className="btn secondary" href="https://agentic-d7af0771.vercel.app" target="_blank" rel="noreferrer">
              Live
            </a>
          </div>
        </header>
        <section className="stage">
          <Scene canvasRef={canvasRef} />
        </section>
        <footer className="footer">
          <p>
            3D logo concept. Drag to orbit. Scroll to zoom. Double-tap to reset.
          </p>
        </footer>
      </main>
    </>
  );
}

