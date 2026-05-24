import React from 'react';
import { useTablet } from './useTablet';
import { X, Play, RefreshCw } from 'lucide-react';
import tabletOpen from '/assets/tablet/tablet_open.svg';
import tabletClosed from '/assets/tablet/tablet_closed.svg';

const Tablet = ({ user }) => {
  const { 
    isOpen, 
    toggleTablet, 
    videoUrl, 
    setVideoUrl, 
    videoId,
    handleUrlSubmit
  } = useTablet(user);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUrlSubmit(videoUrl);
    }
  };

  return (
    <div className="relative w-full select-none group">
      {/* 태블릿 본체: 닫혀있을 때는 클릭 시 열림 */}
      <div 
        className={`cursor-pointer group-hover:rotate-1 ${
          !isOpen ? 'translate-y-[40%]' : ''
        }`}
        onClick={toggleTablet}
      >
        <img 
          src={isOpen ? tabletOpen : tabletClosed} 
          alt="Tablet" 
          className="w-full h-auto drop-shadow-md"
          draggable={false}
        />
      </div>

      {/* 닫기 버튼: 열려있을 때만 노출 */}
      {isOpen && (
        <button 
          onClick={toggleTablet}
          className="absolute top-[0.2%] right-[0.1%] z-50 p-1 bg-black/15 hover:bg-black/30 rounded-full opacity-0 group-hover:opacity-100"
          title="태블릿 덮기"
        >
          <X size={14} className="text-black" strokeWidth={3} />
        </button>
      )}

      {/* 태블릿 화면 영역: SVG 디자인에 맞춰 좌표(top, left 등)를 미세 조정하세요 */}
      {isOpen && (
        <div className="absolute top-[12%] left-[5%] right-[6%] bottom-[9%] bg-[#121212] rounded-[5px] overflow-hidden flex flex-col items-center justify-center shadow-inner">
          {!videoId ? (
            <div className="w-full px-3 flex flex-col items-center gap-2">
              <p className="text-white/40 text-[10px] font-['Patrick_Hand']">YouTube Link</p>
              <div className="relative w-full flex items-center">
                <input 
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="URL..."
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-[9px] text-white outline-none focus:border-white/30 pr-6"
                />
                <button onClick={() => handleUrlSubmit(videoUrl)} className="absolute right-1.5 text-white/30 hover:text-white">
                  <Play size={12} />
                </button>
              </div>
            </div>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
              title="Tablet Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          
          {/* 비디오 변경 버튼: 호버 시 노출 */}
          {videoId && (
            <button 
              onClick={() => handleUrlSubmit("")}
              className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-black/70 text-white p-1 rounded-sm"
            >
              <RefreshCw size={10} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Tablet;