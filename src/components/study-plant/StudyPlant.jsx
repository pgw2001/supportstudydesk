import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useStudyPlant, getLevel, LEVEL_THRESHOLDS } from "./useStudyPlant";
import Modal from "../common/modal";

const PLANT_SEQUENCE = ['rose', 'sunflower', 'hydrangea', 'lilyOfTheValley', 'hyacinth'];
const MAX_TIME_PER_PLANT = LEVEL_THRESHOLDS[4]; // 한 화분당 최고 레벨(Lv.5)까지 걸리는 시간 (useStudyPlant의 LEVEL_THRESHOLDS와 동기화)

function StudyPlant({ plantProgress = {}, activePlantType = 'rose', onPlantChange, focusTime, plantType }) {
  // 현재 선택된 화분의 개별 진행 시간
  // focusTime이 직접 전달되면 그것을 사용하고, 아니면 plantProgress에서 추출합니다.
  const currentPlantFocusTime = focusTime !== undefined ? focusTime : (plantProgress[activePlantType] || 0);
  const currentPlantType = plantType || activePlantType;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // hook에 현재 화분 정보와 계산된 시간을 전달
  const { 
    displayedLevel, 
    isLevelUpAnimation, 
    svgSrc, 
    progress, 
    remainingTimeText, 
    isMaxLevel 
  } = useStudyPlant(currentPlantFocusTime, currentPlantType);

  // 모달 탭 정의: return 문 이전에 정의해야 합니다.
  const plantTabs = [
    {
      id: 'status', 
      label: '성장상태', 
      title: `${currentPlantType.toUpperCase()} 성장 정보`,
      color: '#fef3c7', // 노란색 포스트잇
      content: (
        <div className="flex flex-col gap-4 py-2 font-['Patrick_Hand']">
          <div className="text-lg">현재 등급: <span className="font-bold text-green-600">Lv.{displayedLevel}</span></div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>성장도</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            {/* 끝이 둥근 프로그레스 바 */}
            <div className="w-full h-4 bg-gray-100 rounded-full border border-black/10 overflow-hidden">
              <div 
                className="h-full bg-green-400 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!isMaxLevel && (
            <div className="text-sm text-gray-500">
              다음 레벨까지: <span className="text-black">{remainingTimeText}</span> 남음
            </div>
          )}
          {isMaxLevel && <div className="text-sm text-blue-500 font-bold">최대 레벨에 도달했습니다! 🎉</div>}
        </div>
      )
    },
    { 
      id: 'collection', 
      label: '컬렉션', 
      title: '나의 화분 컬렉션',
      color: '#dcfce7', // 초록색 포스트잇
      content: (
        <div className="py-2">
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-thin">
            {PLANT_SEQUENCE.map((type, index) => {
              const time = plantProgress[type] || 0;
              // 해금 조건: 첫 번째 화분이거나, 이전 화분의 누적 시간이 만렙(7200초) 이상일 때
              const prevPlantType = index > 0 ? PLANT_SEQUENCE[index - 1] : null;
              const isUnlocked = index === 0 || (plantProgress[prevPlantType] >= MAX_TIME_PER_PLANT);
              
              const level = getLevel(time); // useStudyPlant에서 가져온 getLevel 함수 사용
              return (
                <div 
                  key={type} 
                  onClick={() => isUnlocked && onPlantChange && onPlantChange(type)}
                  className={`flex-shrink-0 w-20 h-24 border-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all shadow-sm ${
                    isUnlocked 
                      ? (currentPlantType === type ? "bg-green-50 border-green-500 scale-105" : "bg-white border-green-200 cursor-pointer hover:border-green-400") 
                      : "bg-gray-50 border-black/5 opacity-60"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img 
                      src={`/assets/study-plants/${type}/${type}_lv${level}.svg`} 
                      alt={type}
                      className={`max-w-full max-h-full object-contain transition-all ${
                        isUnlocked ? "opacity-100" : "filter grayscale brightness-0 opacity-20"
                      }`}
                      onError={(e) => { e.target.style.opacity = '0'; }}
                    />
                  </div>
                  <span className={`font-['Patrick_Hand'] text-[10px] uppercase tracking-tighter ${
                    isUnlocked ? "text-green-700 font-bold" : "text-gray-400"
                  }`}>
                    {isUnlocked ? type : 'Locked'}
                  </span>
                  {isUnlocked && <span className="text-[9px] text-green-500 font-bold">Lv.{level}</span>}
                </div>
              );
            })}
          </div>
          <p className="font-['Patrick_Hand'] text-[10px] text-center text-gray-400 mt-2 italic">성장시켜서 새로운 식물을 해제하세요!</p>
        </div>
      ) 
    }
  ];

  // 레벨이 올라갈수록 SVG 전체 크기가 커지면서 object-contain에 의해 화분이 작아지는 것을 방지합니다.
  // 레벨 1을 100% 기준으로 하여, 레벨업 시 화분 본체의 시각적 크기가 일정하게 유지되도록 배율을 적용합니다.
  // (기본 1.0에서 레벨당 0.15씩 증가 - SVG 디자인에 따라 수치는 조정 가능합니다)
  // 보정치를 0.4로 대폭 높여 화분 크기가 줄어드는 현상을 방지합니다.
  // 만약 여전히 화분이 작아진다면 0.45나 0.5로 더 높여보세요.
  const levelScale = 1 + (displayedLevel - 1) * 0.35;

  return (
    <div className="flex h-full w-full items-center justify-center transition-all duration-500 pointer-events-none">
      <div className="relative group h-full w-full">
        {/* 레벨업 반짝임 애니메이션 */}
        {isLevelUpAnimation && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 animate-ping bg-yellow-400/10 rounded-full" />
            <Sparkles className="text-yellow-400 w-16 h-16 animate-bounce" fill="currentColor" />
          </div>
        )}

        <div className={`flex h-full w-full items-end justify-center transition-all duration-500 ${isLevelUpAnimation ? 'scale-110' : ''}`}>
          <img
            src={svgSrc}
            alt={`${currentPlantType} level ${displayedLevel}`}
            onClick={() => setIsModalOpen(true)}
            data-no-drag="true"
            className="block h-full w-full object-contain object-bottom transition-all duration-700 hover:brightness-110 filter drop-shadow-[0_0_1px_rgba(0,0,0,0.1)] pointer-events-auto cursor-pointer"
            style={{ 
              transform: `scale(${levelScale})`,
              transformOrigin: 'bottom center'
            }}
            onError={(e) => {
              e.target.style.opacity = '0'; // 이미지 로딩 실패 시 이미지를 숨김
              console.error(`Failed to load image: ${svgSrc}`); // 콘솔에 어떤 이미지가 로딩 실패했는지 출력
            }}
          />
        </div>
      </div>

      {/* 화분 정보 플로팅 창 */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        tabs={plantTabs}
      >
      </Modal>
    </div>
  );
}

export default StudyPlant;
