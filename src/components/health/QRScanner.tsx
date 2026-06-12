'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X } from 'lucide-react';
import styles from './QRScanner.module.css';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    
    if (videoRef.current) {
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          onScan(result.getText());
          codeReader.reset();
        }
        if (err && err.name !== 'NotFoundException') {
          console.error(err);
        }
      });
    }

    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Scan Meal QR Code</h3>
          <button onClick={onClose} className={styles.closeBtn}><X /></button>
        </div>
        
        <div className={styles.videoWrapper}>
          <video ref={videoRef} className={styles.video} />
          <div className={styles.scannerOverlay}>
            <div className={styles.scanBox}></div>
          </div>
        </div>

        <p className={styles.hint}>Place child's ID card QR inside the box</p>
      </div>
    </div>
  );
}
