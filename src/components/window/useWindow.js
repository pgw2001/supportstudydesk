import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import rainSound from "../../assets/rain.mp3";

const WINDOW_BG_STORAGE_KEY = "windowBg";
const WINDOW_BG_POSITION_STORAGE_KEY = "windowBgPosition";
const WINDOW_BG_SCALE_STORAGE_KEY = "windowBgScale";
const WINDOW_RAIN_STORAGE_KEY = "windowRainEnabled";
const WINDOW_RAIN_INTENSITY_KEY = "windowRainIntensity";

// x, y는 0.0(왼쪽/위)에서 1.0(오른쪽/아래) 사이의 값입니다.
const DEFAULT_POSITION = { x: 0, y: 0.4676540687776643 }; // 예: y를 0.4로 하면 이미지가 약간 위로 올라감
const DEFAULT_SCALE = 0.4; // 1.0보다 크면 기본 상태에서 더 확대됩니다.

const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;

const DASHBOARD_ASPECT_RATIO = 16 / 9;
const WINDOW_LAYOUT = {
  leftPercent: -38,
  topPercent: -53,
  widthPercent: 65,
  aspectWidth: 370,
  aspectHeight: 687,
};
const WINDOW_MASK_URL = 'url("/assets/window/mask.svg")';
export const WINDOW_MASK_STYLE = {
  WebkitMaskImage: WINDOW_MASK_URL,
  maskImage: WINDOW_MASK_URL,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskMode: "alpha",
  maskMode: "alpha",
};

const getVisibleWindowCrop = () => {
  const viewportWidth = 100 * DASHBOARD_ASPECT_RATIO;
  const viewportHeight = 100;
  const windowWidth = (WINDOW_LAYOUT.widthPercent / 100) * viewportWidth;
  const windowHeight =
    windowWidth * (WINDOW_LAYOUT.aspectHeight / WINDOW_LAYOUT.aspectWidth);
  const windowLeft = (WINDOW_LAYOUT.leftPercent / 100) * viewportWidth;
  const windowTop = (WINDOW_LAYOUT.topPercent / 100) * viewportHeight;
  const visibleLeft = Math.max(0, windowLeft);
  const visibleTop = Math.max(0, windowTop);
  const visibleRight = Math.min(viewportWidth, windowLeft + windowWidth);
  const visibleBottom = Math.min(viewportHeight, windowTop + windowHeight);

  return {
    x: (visibleLeft - windowLeft) / windowWidth,
    y: (visibleTop - windowTop) / windowHeight,
    width: Math.max(0, visibleRight - visibleLeft) / windowWidth,
    height: Math.max(0, visibleBottom - visibleTop) / windowHeight,
  };
};

const WINDOW_VISIBLE_CROP = getVisibleWindowCrop();
const WINDOW_VISIBLE_PREVIEW_STYLE = {
  width: `${100 / WINDOW_VISIBLE_CROP.width}%`,
  height: `${100 / WINDOW_VISIBLE_CROP.height}%`,
  left: `${(-WINDOW_VISIBLE_CROP.x / WINDOW_VISIBLE_CROP.width) * 100}%`,
  top: `${(-WINDOW_VISIBLE_CROP.y / WINDOW_VISIBLE_CROP.height) * 100}%`,
};
const WINDOW_DASHBOARD_BUTTON_STYLE = {
  left: `${(WINDOW_VISIBLE_CROP.x + WINDOW_VISIBLE_CROP.width / 2) * 100}%`,
  top: `${(WINDOW_VISIBLE_CROP.y + WINDOW_VISIBLE_CROP.height / 2) * 100}%`,
  transform: "translate(-50%, -50%)",
};
const WINDOW_VISIBLE_PREVIEW_ASPECT =
  (WINDOW_VISIBLE_CROP.width * WINDOW_LAYOUT.aspectWidth) /
  (WINDOW_VISIBLE_CROP.height * WINDOW_LAYOUT.aspectHeight);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const readStoredPosition = () => {
  const saved = localStorage.getItem(WINDOW_BG_POSITION_STORAGE_KEY);

  if (!saved) {
    return DEFAULT_POSITION;
  }

  try {
    const parsed = JSON.parse(saved);

    if (
      typeof parsed?.x === "number" &&
      typeof parsed?.y === "number"
    ) {
      return {
        x: clamp(parsed.x, 0, 1),
        y: clamp(parsed.y, 0, 1),
      };
    }
  } catch (error) {
    console.error("Failed to parse saved window background position.", error);
  }

  return DEFAULT_POSITION;
};

const readStoredScale = () => {
  const saved = Number(localStorage.getItem(WINDOW_BG_SCALE_STORAGE_KEY));

  if (Number.isFinite(saved)) {
    return clamp(saved, MIN_SCALE, MAX_SCALE);
  }

  return DEFAULT_SCALE;
};

const loadImageSize = (src, onLoad) => {
  if (!src) {
    onLoad(null);
    return undefined;
  }

  const image = new Image();
  image.onload = () => {
    onLoad({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  };
  image.onerror = () => onLoad(null);
  image.src = src;

  return () => {
    image.onload = null;
    image.onerror = null;
  };
};

const getCoverMetrics = (frameSize, imageSize, scale = DEFAULT_SCALE) => {
  if (!frameSize.width || !frameSize.height || !imageSize?.width || !imageSize?.height) {
    return null;
  }

  const coverScale = Math.max(
    frameSize.width / imageSize.width,
    frameSize.height / imageSize.height
  );
  const width = imageSize.width * coverScale * scale;
  const height = imageSize.height * coverScale * scale;

  return {
    width,
    height,
    deltaX: frameSize.width - width,
    deltaY: frameSize.height - height,
  };
};

const getImageStyle = (frameSize, imageSize, position, scale) => {
  const metrics = getCoverMetrics(frameSize, imageSize, scale);

  if (!metrics) {
    return {
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
    };
  }

  return {
    left: `${metrics.deltaX * position.x}px`,
    top: `${metrics.deltaY * position.y}px`,
    width: `${metrics.width}px`,
    height: `${metrics.height}px`,
  };
};

const useElementSize = () => {
  const [node, setNode] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!node) {
      setSize({ width: 0, height: 0 });
      return undefined;
    }

    const updateSize = () => {
      setSize({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [node]);

  return [setNode, size];
};

export const useWindow = (defaultBg) => {
  const [windowBg, setWindowBg] = useState(() => {
    const saved = localStorage.getItem(WINDOW_BG_STORAGE_KEY);
    return saved || defaultBg;
  });
  const [windowPosition, setWindowPosition] = useState(readStoredPosition);
  const [windowScale, setWindowScale] = useState(readStoredScale);
  const [isWindowModalOpen, setIsWindowModalOpen] = useState(false);
  const [draftBg, setDraftBg] = useState(windowBg);
  const [draftPosition, setDraftPosition] = useState(windowPosition);
  const [draftScale, setDraftScale] = useState(windowScale);
  const [windowImageSize, setWindowImageSize] = useState(null);
  const [draftImageSize, setDraftImageSize] = useState(null);
  const [isWindowRainEnabled, setIsWindowRainEnabled] = useState(() => {
    return localStorage.getItem(WINDOW_RAIN_STORAGE_KEY) === "true";
  });
  const [windowRainIntensity, setWindowRainIntensity] = useState(() => {
    const saved = localStorage.getItem(WINDOW_RAIN_INTENSITY_KEY);
    return saved ? parseFloat(saved) : 0.5;
  });

  const [windowFrameRef, windowFrameSize] = useElementSize();
  const [previewFrameRef, previewFrameSize] = useElementSize();
  const fileInputRef = useRef(null);
  const dragStateRef = useRef(null);

  useEffect(() => loadImageSize(windowBg, setWindowImageSize), [windowBg]);
  useEffect(() => loadImageSize(draftBg, setDraftImageSize), [draftBg]);

  // 비 소리 효과 관리
  const rainAudioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(rainSound);
    audio.loop = true;
    rainAudioRef.current = audio;

    return () => {
      audio.pause();
      rainAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(WINDOW_RAIN_STORAGE_KEY, String(isWindowRainEnabled));
    if (!rainAudioRef.current) return;

    if (isWindowRainEnabled) {
      rainAudioRef.current.volume = windowRainIntensity;
      rainAudioRef.current.play().catch((error) => {
        console.warn("Audio play blocked or failed:", error);
      });
    } else {
      rainAudioRef.current.pause();
    }
  }, [isWindowRainEnabled]);

  useEffect(() => {
    localStorage.setItem(WINDOW_RAIN_INTENSITY_KEY, String(windowRainIntensity));
    if (rainAudioRef.current) {
      rainAudioRef.current.volume = windowRainIntensity;
    }
  }, [windowRainIntensity]);

  useEffect(() => {
    localStorage.setItem(WINDOW_BG_STORAGE_KEY, windowBg);
  }, [windowBg]);

  useEffect(() => {
    localStorage.setItem(
      WINDOW_BG_POSITION_STORAGE_KEY,
      JSON.stringify(windowPosition)
    );
  }, [windowPosition]);

  useEffect(() => {
    localStorage.setItem(WINDOW_BG_SCALE_STORAGE_KEY, String(windowScale));
  }, [windowScale]);

  const openWindowEditor = useCallback(() => {
    setDraftBg(windowBg);
    setDraftPosition(windowPosition);
    setDraftScale(windowScale);
    setIsWindowModalOpen(true);
  }, [windowBg, windowPosition, windowScale]);

  const closeWindowEditor = useCallback(() => {
    setIsWindowModalOpen(false);
  }, []);

  const applyWindowBackground = useCallback(() => {
    setWindowBg(draftBg);
    setWindowPosition(draftPosition);
    setWindowScale(draftScale);
    setIsWindowModalOpen(false);
  }, [draftBg, draftPosition, draftScale]);

  const resetDraftWindowBackground = useCallback(() => {
    setDraftBg(defaultBg);
    setDraftPosition(DEFAULT_POSITION);
    setDraftScale(DEFAULT_SCALE);
  }, [defaultBg]);

  const resetWindowBackground = useCallback(() => {
    setWindowBg(defaultBg);
    setWindowPosition(DEFAULT_POSITION);
    setWindowScale(DEFAULT_SCALE);
    setDraftBg(defaultBg);
    setDraftPosition(DEFAULT_POSITION);
    setDraftScale(DEFAULT_SCALE);
    localStorage.removeItem(WINDOW_BG_STORAGE_KEY);
    localStorage.removeItem(WINDOW_BG_POSITION_STORAGE_KEY);
    localStorage.removeItem(WINDOW_BG_SCALE_STORAGE_KEY);
  }, [defaultBg]);

  const updateDraftScale = useCallback((nextScale) => {
    setDraftScale(clamp(nextScale, MIN_SCALE, MAX_SCALE));
  }, []);

  const triggerFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleWindowBgChange = useCallback((event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setDraftBg(reader.result);
        setDraftPosition(DEFAULT_POSITION);
      }
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  }, []);

  const previewPointerHandlers = useMemo(() => ({
    onPointerDown: (event) => {
      const metrics = getCoverMetrics(previewFrameSize, draftImageSize, draftScale);

      if (!metrics) {
        return;
      }

      dragStateRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startPosition: draftPosition,
        metrics,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event) => {
      const dragState = dragStateRef.current;

      if (!dragState) {
        return;
      }

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;

      setDraftPosition({
        x: dragState.metrics.deltaX
          ? clamp(
              dragState.startPosition.x + deltaX / dragState.metrics.deltaX,
              0,
              1
            )
          : 0.5,
        y: dragState.metrics.deltaY
          ? clamp(
              dragState.startPosition.y + deltaY / dragState.metrics.deltaY,
              0,
              1
            )
          : 0.5,
      });
    },
    onPointerUp: (event) => {
      dragStateRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    onPointerCancel: (event) => {
      dragStateRef.current = null;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
  }), [draftImageSize, draftPosition, draftScale, previewFrameSize]);

  return {
    fileInputRef,
    windowBg,
    isWindowModalOpen,
    draftBg,
    openWindowEditor,
    closeWindowEditor,
    applyWindowBackground,
    resetDraftWindowBackground,
    resetWindowBackground,
    draftScale,
    updateDraftScale,
    minScale: MIN_SCALE,
    maxScale: MAX_SCALE,
    triggerFilePicker,
    handleWindowBgChange,
    previewPointerHandlers,
    windowFrameRef,
    previewFrameRef,
    windowImageStyle: getImageStyle(windowFrameSize, windowImageSize, windowPosition, windowScale),
    previewImageStyle: getImageStyle(previewFrameSize, draftImageSize, draftPosition, draftScale),
    hasCustomWindowBg: windowBg !== defaultBg,
    windowMaskStyle: WINDOW_MASK_STYLE,
    previewContainerStyle: WINDOW_VISIBLE_PREVIEW_STYLE,
    windowButtonStyle: WINDOW_DASHBOARD_BUTTON_STYLE,
    previewAspect: WINDOW_VISIBLE_PREVIEW_ASPECT,
    isWindowRainEnabled,
    setIsWindowRainEnabled,
    windowRainIntensity,
    setWindowRainIntensity,
  };
};
