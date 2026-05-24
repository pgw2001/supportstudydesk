import {
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  saveUserData,
  loadUserData,
} from "../../services/userData";

export const useTablet = (user) => {
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
      return;
    }

    const id = extractYoutubeId(url);
    if (id) {
      setVideoId(id);
    } else {
      alert('유효한 유튜브 링크를 입력해주세요.');
    }
  }, []);

  const toggleTablet = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const [isTabletLoaded, setIsTabletLoaded] =
useState(false);

useEffect(() => {

  setIsTabletLoaded(false);

  const loadTabletData =
    async () => {

      // 로그아웃 상태
      if (!user?.uid) {

        setVideoId(null);

        setVideoUrl("");

        setIsOpen(false);

        setIsTabletLoaded(true);

        return;
      }

      const data =
        await loadUserData(
          user.uid
        );

      setVideoId(
        data?.tabletVideoId ||
        null
      );

      setIsOpen(
        data?.tabletIsOpen ||
        false
      );

      setIsTabletLoaded(true);
    };

  loadTabletData();

  }, [user]);

  useEffect(() => {

  if (
    !isTabletLoaded ||
    !user?.uid ||
    user?.isGuest
  ) {
    return;
  }

  saveUserData(
    user.uid,
    {
      tabletVideoId:
        videoId,

      tabletIsOpen:
        isOpen,
    }
  );

  }, [
  videoId,
  isOpen,
  user,
  isTabletLoaded,
  ]);

  return {
    isOpen,
    toggleTablet,
    videoUrl,
    setVideoUrl,
    videoId,
    handleUrlSubmit,
  };
};