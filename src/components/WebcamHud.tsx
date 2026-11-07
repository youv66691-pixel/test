import React from 'react';
import { CameraStatus, GestureDetectionState, InputMode } from '../types';
import { Camera, CameraOff, ShieldCheck, RefreshCw, MousePointer, Hand } from 'lucide-react';

interface WebcamHudProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cameraStatus: CameraStatus;
  errorMessage: string | null;
  gestureState: GestureDetectionState;
  inputMode: InputMode;
  onToggleInputMode: (mode: InputMode) => void;
  onRetryCamera: () => void;
  isAnswered: boolean;
}

export const WebcamHud: React.FC<WebcamHudProps> = ({
  videoRef,
  canvasRef,
  cameraStatus,
  errorMessage,
  gestureState,
  inputMode,
  onToggleInputMode,
  onRetryCamera,
  isAnswered
}) => {
  const {
    isHandPresent,
    fingerCount,
    extendedFingers,
    candidateChoice,
    holdProgress,
    holdRemainingSeconds,
    isHoldCompleted
  } = gestureState;

  // Circular progress math
  const strokeDashoffset = 125.6 * (1 - holdProgress);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col gap-3">
      {/* Header zone with Mode Switch */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            {inputMode === 'gesture' ? (
              <Hand className="w-4 h-4 text-cyan-400" />
            ) : (
              <MousePointer className="w-4 h-4 text-emerald-400" />
            )}
            {inputMode === 'gesture' ? 'AI 손가락 제스처 인식' : '마우스 클릭 입력'}
          </span>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => onToggleInputMode('gesture')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              inputMode === 'gesture'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            제스처
          </button>
          <button
            type="button"
            onClick={() => onToggleInputMode('mouse')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
              inputMode === 'mouse'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            마우스
          </button>
        </div>
      </div>

      {/* Main Camera / Fallback Viewport */}
      {inputMode === 'gesture' ? (
        <div className="relative w-full aspect-4/3 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {/* Hidden or mirrored Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover -scale-x-100 ${
              cameraStatus === 'ready' ? 'opacity-90' : 'opacity-0'
            }`}
          />

          {/* Skeleton Canvas Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Status Overlay: Loading / Error / Permission Denied */}
          {cameraStatus === 'loading_engine' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center gap-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-200">MediaPipe 비전 엔진 로딩 중</p>
                <p className="text-xs text-slate-400 mt-1">온디바이스 손 인식 모델을 준비하고 있습니다...</p>
              </div>
            </div>
          )}

          {cameraStatus === 'requesting_camera' && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center gap-3">
              <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-slate-200">카메라 권한 확인 중</p>
                <p className="text-xs text-slate-400 mt-1">브라우저의 카메라 사용을 허용해 주세요.</p>
              </div>
            </div>
          )}

          {(cameraStatus === 'permission_denied' ||
            cameraStatus === 'no_camera_found' ||
            cameraStatus === 'engine_error') && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-4 text-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400">
                <CameraOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-300">
                  {cameraStatus === 'permission_denied'
                    ? '카메라 접근이 차단됨'
                    : cameraStatus === 'no_camera_found'
                    ? '카메라 미연결'
                    : '비전 엔진 오류'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed px-2">
                  {errorMessage || '카메라를 사용할 수 없습니다.'}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-[200px] mt-1">
                <button
                  type="button"
                  onClick={() => onToggleInputMode('mouse')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MousePointer className="w-3.5 h-3.5" />
                  마우스 모드로 즉시 풀기
                </button>
                <button
                  type="button"
                  onClick={onRetryCamera}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  카메라 다시 시도
                </button>
              </div>
            </div>
          )}

          {/* Real-time Visual HUD Target Overlay */}
          {cameraStatus === 'ready' && (
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <div className="px-2 py-0.5 bg-slate-900/80 backdrop-blur rounded text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                LIVE VISION
              </div>
              {isHandPresent && (
                <div className="px-2 py-0.5 bg-slate-900/80 backdrop-blur rounded text-[11px] font-medium text-slate-200 border border-slate-700">
                  손가락: {fingerCount}개
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Mouse mode friendly hero card */
        <div className="w-full aspect-4/3 bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
            <MousePointer className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">마우스 클릭 모드 활성화</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[220px]">
              문제의 1~4번 선지를 직접 클릭하여 정답을 선택할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleInputMode('gesture')}
            className="mt-1 px-3 py-1.5 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Hand className="w-3.5 h-3.5" />
            손가락 제스처 모드로 전환
          </button>
        </div>
      )}

      {/* Live Hold Progress Bar / Circular Gauge */}
      {inputMode === 'gesture' && cameraStatus === 'ready' && (
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Circular Gauge */}
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 48 48">
                  {/* Background Circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                  />
                  {/* Animated Progress Circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke={isHoldCompleted ? '#10b981' : candidateChoice ? '#06b6d4' : '#64748b'}
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-75 ease-out"
                  />
                </svg>
                <span className="absolute font-bold text-xs text-slate-100 font-mono">
                  {candidateChoice ? candidateChoice : isAnswered ? '5' : '-'}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  {isAnswered ? (
                    candidateChoice === 5 ? (
                      <span className="text-emerald-400 font-bold">🖐️ 다음 문제로 이동 중!</span>
                    ) : (
                      <span className="text-cyan-400 font-medium">🖐️ 손가락 5개 펴서 다음 문제로</span>
                    )
                  ) : candidateChoice ? (
                    <span className="text-cyan-400 font-bold">{candidateChoice}번 선지 감지</span>
                  ) : fingerCount === 5 ? (
                    <span className="text-amber-400">손가락 1~4개를 펼쳐주세요</span>
                  ) : isHandPresent ? (
                    <span className="text-slate-400">손가락을 1~4개 펴주세요</span>
                  ) : (
                    <span className="text-slate-400">카메라에 손을 보여주세요</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isAnswered ? (
                    candidateChoice === 5 ? (
                      <span>
                        1.5초 유지 시 이동 (
                        <span className="text-emerald-300 font-mono font-medium">
                          {Math.round(holdProgress * 100)}%
                        </span>
                        )
                      </span>
                    ) : (
                      <span className="text-slate-400">손가락 5개를 1.5초간 펴거나 버튼 클릭</span>
                    )
                  ) : candidateChoice ? (
                    <span>
                      1.5초 유지 시 확정 (
                      <span className="text-cyan-300 font-mono font-medium">
                        {Math.round(holdProgress * 100)}%
                      </span>
                      )
                    </span>
                  ) : (
                    <span>손가락 1~4개로 선지 선택</span>
                  )}
                </div>
              </div>
            </div>

            {/* Countdown seconds tag */}
            {candidateChoice && (
              <div className={`px-2 py-1 rounded-md text-[11px] font-mono border ${
                candidateChoice === 5
                  ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300'
                  : 'bg-cyan-950/70 border-cyan-800/80 text-cyan-300'
              }`}>
                {holdRemainingSeconds.toFixed(1)}초
              </div>
            )}
          </div>

          {/* Extended Fingers Badges */}
          <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-slate-800/60 text-center">
            {[
              { label: '엄지', on: extendedFingers.thumb },
              { label: '검지', on: extendedFingers.index },
              { label: '중지', on: extendedFingers.middle },
              { label: '약지', on: extendedFingers.ring },
              { label: '소지', on: extendedFingers.pinky }
            ].map((f) => (
              <div
                key={f.label}
                className={`py-0.5 rounded text-[10px] font-medium transition-colors ${
                  f.on
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {f.label} {f.on ? '✓' : '·'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-snug">
          <strong className="text-emerald-400 font-semibold block mb-0.5">
            100% 온디바이스 개인정보 보호
          </strong>
          웹캠 영상은 외부 서버로 전송되지 않으며, 사용자 브라우저(MediaPipe) 내부에서만 실시간으로 즉시 처리됩니다.
        </div>
      </div>
    </div>
  );
};
