import { useMemo } from "react";

const DEFAULT_DROPS = 100; // 빗줄기 스타일은 개수가 많아야 더 자연스럽습니다.

const createRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const createDrops = ({ count, intensity, seed = 17 }) => {
  const random = createRandom(seed);
  const speedFactor = 0.5 + intensity; // 높을수록 빠름

  return Array.from({ length: count }, (_, index) => {
    const thickness = 0.5 + random() * 1.5; // 0.5px ~ 2px 사이의 랜덤 굵기
    const length = 15 + random() * 25;    // 15px ~ 40px 사이의 랜덤 길이
    const duration = (0.6 + random() * 0.4) / speedFactor; // 강도에 따른 속도 변화

    return {
      id: `rain-streak-${index}`,
      x: random() * 100, // 좌우 랜덤 위치
      thickness,
      length,
      opacity: 0.1 + random() * 0.3, // 검은색이므로 너무 진하지 않게 설정
      duration,
      delay: -random() * 5, // 애니메이션 시작점 분산
    };
  });
};

const createSplashes = (count, seed = 42) => {
  const random = createRandom(seed);
  return Array.from({ length: count }, (_, index) => ({
    id: `splash-${index}`,
    x: random() * 100,
    size: 2 + random() * 6,
    delay: random() * 2,
    duration: 0.4 + random() * 0.4,
  }));
};

function RainDrop({ drop }) {
  return (
    <div
      className="absolute bg-black will-change-transform"
      style={{
        left: `${drop.x}%`,
        top: `0%`, 
        width: `${drop.thickness}px`,
        height: `${drop.length}px`,
        opacity: drop.opacity,
        animation: `rainyWindowFall ${drop.duration}s steps(12) infinite`,
        animationDelay: `${drop.delay}s`,
        transform: 'translateY(-100%)',
      }}
    />
  );
}

function RainSplash({ splash, intensity }) {
  const speedFactor = 0.5 + intensity;
  return (
    <div
      className="absolute bottom-0 rounded-full border border-black/20"
      style={{
        left: `${splash.x}%`,
        width: `${splash.size}px`,
        height: `${splash.size * 0.6}px`,
        animation: `rainyWindowSplash ${splash.duration / speedFactor}s steps(8) infinite`,
        animationDelay: `${splash.delay}s`,
        opacity: 0,
      }}
    />
  );
}

export default function RainyWindowOverlay({
  enabled = false,
  intensity = 0.5,
  className = "",
  seed = 17,
}) {
  const dropCount = Math.floor(20 + intensity * 180); // 강도에 따라 20개 ~ 200개
  const splashCount = Math.floor(10 + intensity * 40);

  const drops = useMemo(
    () => createDrops({ count: dropCount, intensity, seed }),
    [dropCount, intensity, seed]
  );

  const splashes = useMemo(
    () => createSplashes(splashCount, seed + 1),
    [splashCount, seed]
  );

  if (!enabled) {
    return null;
  }

  return (
    <div className={`absolute inset-0 z-[2] overflow-hidden pointer-events-none ${className}`}>
      <style>{`
        @keyframes rainyWindowFall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        @keyframes rainyWindowSplash {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>

      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px]" />

      {drops.map((drop) => (
        <RainDrop key={drop.id} drop={drop} />
      ))}

      {splashes.map((splash) => (
        <RainSplash key={splash.id} splash={splash} intensity={intensity} />
      ))}
    </div>
  );
}
