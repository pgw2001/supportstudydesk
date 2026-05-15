import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

function StudyPlant({ focusTime = 0, plantType = "rose" }) {
  /**
   * 학습 시간(초)에 따른 성장 단계 계산 (예시 임계값)
   * Lv 1: 0분 ~ 10분 미만
   * Lv 2: 10분 ~ 30분 미만
   * Lv 3: 30분 ~ 1시간 미만
   * Lv 4: 1시간 ~ 2시간 미만
   * Lv 5: 2시간 이상
   */
  const getLevel = (seconds) => {
    const mins = seconds / 60;
    if (mins < 10) return 1;
    if (mins < 30) return 2;
    if (mins < 60) return 3;
    if (mins < 120) return 4;
    return 5;
  };

  // 현재 화면에 표시될 레벨 (애니메이션 중에는 이전 레벨을 유지)
  const [displayedLevel, setDisplayedLevel] = useState(getLevel(focusTime));
  // 레벨업 애니메이션 활성화 여부
  const [isLevelUpAnimation, setIsLevelUpAnimation] = useState(false);

  useEffect(() => {
    const newCalculatedLevel = getLevel(focusTime);

    // 레벨이 상승했을 때만 애니메이션 및 효과음 재생
    if (newCalculatedLevel > displayedLevel) {
      setIsLevelUpAnimation(true);
      
      // 효과음 재생 (public/assets/sounds/level-up.mp3 경로에 파일이 있어야 합니다)
      const audio = new Audio("/assets/sounds/level-up.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => console.log("Sound play interaction required"));

      // 애니메이션이 끝난 후 displayedLevel 업데이트 및 애니메이션 상태 초기화
      const timer = setTimeout(() => {
        setIsLevelUpAnimation(false);
        setDisplayedLevel(newCalculatedLevel);
      }, 2000); // 애니메이션 지속 시간
      return () => clearTimeout(timer);
    } else if (newCalculatedLevel < displayedLevel) {
      // focusTime이 감소하여 레벨이 내려갔을 경우 즉시 업데이트 (예: 타이머 리셋)
      setDisplayedLevel(newCalculatedLevel);
    } else if (newCalculatedLevel === displayedLevel && !isLevelUpAnimation) {
      // 레벨이 같고 애니메이션이 실행 중이 아니라면, displayedLevel을 현재 계산된 레벨로 동기화
      setDisplayedLevel(newCalculatedLevel);
    }
  }, [focusTime, displayedLevel, isLevelUpAnimation]); // focusTime이 변경될 때마다 레벨을 다시 계산하고, displayedLevel과 비교

  // 이미지 경로는 public 폴더를 기준으로 설정하는 것이 안정적입니다.
  const svgSrc = `assets/study-plants/${plantType}/${plantType}_lv${displayedLevel}.svg`;

  return (
    <div className="flex flex-col items-center justify-center transition-all duration-500 pointer-events-none">
      <div className="relative group">
        {/* 레벨업 반짝임 애니메이션 */}
        {isLevelUpAnimation && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 animate-ping bg-yellow-400/10 rounded-full" />
            <Sparkles className="text-yellow-400 w-16 h-16 animate-bounce" fill="currentColor" />
          </div>
        )}

        <div className={`w-24 h-24 flex items-center justify-center transition-all duration-500 ${isLevelUpAnimation ? 'scale-110' : ''}`}>
          <img
            src={svgSrc}
            alt={`${plantType} level ${displayedLevel}`}
            className="max-h-full max-w-full object-contain transition-transform duration-700 transform hover:scale-110 filter drop-shadow-[0_0_1px_rgba(0,0,0,0.1)] pointer-events-auto cursor-pointer"
            onError={(e) => {
              e.target.style.opacity = '0'; // 이미지 로딩 실패 시 이미지를 숨김
              console.error(`Failed to load image: ${svgSrc}`); // 콘솔에 어떤 이미지가 로딩 실패했는지 출력
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StudyPlant;