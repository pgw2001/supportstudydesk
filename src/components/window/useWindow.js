import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const WINDOW_BG_STORAGE_KEY = "windowBg";
const WINDOW_BG_POSITION_STORAGE_KEY = "windowBgPosition";
const WINDOW_BG_SCALE_STORAGE_KEY = "windowBgScale";
const DEFAULT_POSITION = { x: 0.5, y: 0.5 };
const DEFAULT_SCALE = 1;
const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;

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

  const [windowFrameRef, windowFrameSize] = useElementSize();
  const [previewFrameRef, previewFrameSize] = useElementSize();
  const fileInputRef = useRef(null);
  const dragStateRef = useRef(null);

  useEffect(() => loadImageSize(windowBg, setWindowImageSize), [windowBg]);
  useEffect(() => loadImageSize(draftBg, setDraftImageSize), [draftBg]);

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
  };
};
