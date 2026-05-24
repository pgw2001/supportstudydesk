import { useState, useCallback, useEffect } from 'react';

export const useTablet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState(null);

  // 다양한 유튜브 URL 형식에서 비디오 ID만 추출하는 정규식
  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleUrlSubmit = useCallback((url) => {
    if (!url || url.trim() === '') {
      setVideoId(null);
      localStorage.removeItem('tablet_video_id');
      return;
    }

    const id = extractYoutubeId(url);
    if (id) {
      setVideoId(id);
      localStorage.setItem('tablet_video_id', id);
    } else {
      alert('유효한 유튜브 링크를 입력해주세요.');
    }
  }, []);

  const toggleTablet = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // 초기 로드: ID 불러오기
  useEffect(() => {
    const savedId = localStorage.getItem('tablet_video_id');
    if (savedId) setVideoId(savedId);
  }, []);

  return {
    isOpen,
    toggleTablet,
    videoUrl,
    setVideoUrl,
    videoId,
    handleUrlSubmit,
  };
};