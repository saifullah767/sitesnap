import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import Draggable from 'react-draggable';
import iMacMockup from '../../assets/Apple-iMac-Retina.svg';
import macbookMockup from '../../assets/Apple-Macbook-Pro-13_ Silver.svg';
import iPadMockup from '../../assets/Apple-iPad-Pro-13_Space-Gray-Portrait.svg';
import iPhoneMockup from '../../assets/Apple-iPhone-11-Pro-Max-Gold.svg';
import dellPortraitMockup from '../../assets/Dell-UltraSharp-5K-Monitor-27_ 90deg.svg';

export type DeviceType = 'monitor' | 'monitorPortrait' | 'laptop' | 'tablet' | 'mobile';

interface DeviceFrameProps {
  type: DeviceType;
  url: string;
  baseZ?: number;
  dragScale?: number;
}

type AssetConfig = {
  width: string;
  height: string;
  assetSrc: string;
  screen: {
    left: string;
    top: string;
    width: string;
    height: string;
    radius: string;
  };
};

type DeviceConfig = AssetConfig;

const DEVICE_CONFIG: Record<DeviceType, DeviceConfig> = {
  monitor: {
    width: 'w-[900px]',
    height: 'h-[880px]',
    assetSrc: iMacMockup,
    screen: {
      left: '3.2%',
      top: '12.2%',
      width: '93.6%',
      height: '53.9%',
      radius: '0',
    },
  },
  monitorPortrait: {
    width: 'w-[320px]',
    height: 'h-[552px]',
    assetSrc: dellPortraitMockup,
    screen: {
      left: '2.8%',
      top: '0.9%',
      width: '93.7%',
      height: '90.4%',
      radius: '2px',
    },
  },
  laptop: {
    width: 'w-[820px]',
    height: 'h-[521px]',
    assetSrc: macbookMockup,
    screen: {
      left: '12.6%',
      top: '12.7%',
      width: '74.8%',
      height: '74%',
      radius: '5px',
    },
  },
  tablet: {
    width: 'w-[380px]',
    height: 'h-[486px]',
    assetSrc: iPadMockup,
    screen: {
      left: '4.7%',
      top: '3.7%',
      width: '90.6%',
      height: '92.6%',
      radius: '28px',
    },
  },
  mobile: {
    width: 'w-[260px]',
    height: 'h-[510px]',
    assetSrc: iPhoneMockup,
    screen: {
      left: '7.0%',
      top: '3.6%',
      width: '86.0%',
      height: '92.8%',
      radius: '36px',
    },
  },
};

export default function DeviceFrame({
  type,
  url,
  baseZ = 1,
  dragScale = 1,
}: DeviceFrameProps) {
  const config = DEVICE_CONFIG[type];
  const nodeRef = useRef<HTMLDivElement>(null);
  const [zIndex, setZIndex] = useState(baseZ);
  const [isDragging, setIsDragging] = useState(false);

  const renderFallback = () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <div className="text-slate-200 text-[12px] font-black uppercase tracking-[0.3em] animate-pulse">
        Sync Active
      </div>
    </div>
  );

  const renderDevice = (assetConfig: AssetConfig) => (
    <div
      className={`relative ${assetConfig.width} ${assetConfig.height} cursor-grab active:cursor-grabbing`}
    >
      <div
        className="absolute overflow-hidden bg-white z-10"
        style={{
          left: assetConfig.screen.left,
          top: assetConfig.screen.top,
          width: assetConfig.screen.width,
          height: assetConfig.screen.height,
          borderRadius: assetConfig.screen.radius,
        }}
      >
        {url ? (
          <iframe
            src={url}
            className={`w-full h-full border-none ${isDragging ? 'pointer-events-none' : 'pointer-events-auto'}`}
            title={`${type} preview`}
            referrerPolicy="no-referrer"
            style={{zoom: 0.5}}
          />
        ) : (
          renderFallback()
        )}
      </div>
      <img
        src={assetConfig.assetSrc}
        alt={`${type} mockup`}
        className="absolute inset-0 w-full h-full z-20 pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );

  return (
    <Draggable
      nodeRef={nodeRef}
      scale={dragScale}
      onStart={() => {
        setIsDragging(true);
        setZIndex(1000);
      }}
      onStop={() => {
        setIsDragging(false);
        setZIndex(baseZ);
      }}
    >
      <div
        ref={nodeRef}
        className="absolute select-none"
        style={{ touchAction: 'none', zIndex }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center group/device"
        >
          {renderDevice(config)}
        </motion.div>
      </div>
    </Draggable>
  );
}
