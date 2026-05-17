import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useStudyPlant } from "./useStudyPlant";
import Modal from "../common/modal";

function StudyPlant({ focusTime = 0, plantType = "rose" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    displayedLevel, 
    isLevelUpAnimation, 
    svgSrc, 
    progress, 
    remainingTimeText, 
    isMaxLevel 
  } = useStudyPlant(focusTime, plantType);

  // 모달 탭 정의: return 문 이전에 정의해야 합니다.
  const plantTabs = [
    {
      id: 'status', 
      label: '성장상태', 
      title: `${plantType.toUpperCase()} 성장 정보`,
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
      content: <div className="p-4 font-['Patrick_Hand'] text-gray-600">아직 컬렉션 기능은 준비 중입니다!</div> 
    }
  ];

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
            onClick={() => setIsModalOpen(true)}
            data-no-drag="true"
            className="max-h-full max-w-full object-contain transition-transform duration-700 transform hover:scale-110 filter drop-shadow-[0_0_1px_rgba(0,0,0,0.1)] pointer-events-auto cursor-pointer"
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