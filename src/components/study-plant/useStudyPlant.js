import { useState, useEffect } from "react";

const handlePlantClick = (e) => {
  e.stopPropagation(); // 드래그 이벤트가 발생하는 것을 방지
  setIsOpen(true);    // 플로팅 창 열기
};
export const LEVEL_THRESHOLDS = [0, 600, 1800, 3600, 7200]; // 초 단위 (0, 10분, 30분, 1시간, 2시간)

export const getLevel = (seconds) => {
  /**
   * 학습 시간(초)에 따른 성장 단계 계산 (예시 임계값)
   */
  if (seconds < LEVEL_THRESHOLDS[1]) return 1;
  if (seconds < LEVEL_THRESHOLDS[2]) return 2;
  if (seconds < LEVEL_THRESHOLDS[3]) return 3;
  if (seconds < LEVEL_THRESHOLDS[4]) return 4;
  return 5;
};

export function useStudyPlant(focusTime = 0, plantType = "rose") {

  // 현재 화면에 표시될 레벨 (애니메이션 중에는 이전 레벨을 유지)
  const [displayedLevel, setDisplayedLevel] = useState(getLevel(focusTime));
  // 레벨업 애니메이션 활성화 여부
  const [isLevelUpAnimation, setIsLevelUpAnimation] = useState(false);

  const newCalculatedLevel = getLevel(focusTime);

  useEffect(() => {
    // 레벨이 상승했고, 현재 애니메이션이 진행 중이지 않을 때만 실행
    if (newCalculatedLevel > displayedLevel && !isLevelUpAnimation) {
      setIsLevelUpAnimation(true);
      
      // 효과음 재생 (public/assets/sounds/level-up.mp3 경로에 파일이 있어야 합니다)
      const audio = new Audio("/assets/sounds/level-up.mp3");
      audio.volume = 0.5;
      audio.play().catch((err) => console.warn("오디오 재생 차단됨 (사용자 상호작용 필요):", err.message));

      // 애니메이션이 끝난 후 displayedLevel 업데이트 및 애니메이션 상태 초기화
      const timer = setTimeout(() => {
        setIsLevelUpAnimation(false);
        setDisplayedLevel(newCalculatedLevel);
      }, 2000); // 애니메이션 지속 시간
      return () => clearTimeout(timer);
    } else if (newCalculatedLevel < displayedLevel) {
      // focusTime이 감소하여 레벨이 내려갔을 경우 즉시 업데이트 (예: 타이머 리셋)
      setDisplayedLevel(newCalculatedLevel);
      setIsLevelUpAnimation(false);
    }
  }, [newCalculatedLevel]); // focusTime 대신 레벨 수치가 바뀔 때만 실행하여 타이머가 취소되지 않게 함

  // 이미지 경로는 public 폴더를 기준으로 설정하는 것이 안정적입니다.
  const svgSrc = `/assets/study-plants/${plantType}/${plantType}_lv${displayedLevel}.svg`;

  // 성장 정보 계산
  const currentLevel = getLevel(focusTime);
  let progress = 0;
  let remainingTime = 0;

  if (currentLevel < 5) {
    const start = LEVEL_THRESHOLDS[currentLevel - 1];
    const end = LEVEL_THRESHOLDS[currentLevel];
    const total = end - start;
    const current = focusTime - start;
    progress = Math.min(100, Math.max(0, (current / total) * 100));
    remainingTime = end - focusTime;
  } else {
    progress = 100;
    remainingTime = 0;
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}분 ${s}초`;
  };

  return { 
    displayedLevel, 
    isLevelUpAnimation, 
    svgSrc, 
    progress, 
    remainingTimeText: formatTime(remainingTime),
    isMaxLevel: currentLevel === 5 
  };
}