import React, { useState, useCallback } from 'react';
import { SCIENCE_QUESTIONS } from './data/questions';
import { InputMode } from './types';
import { useHandLandmarker } from './hooks/useHandLandmarker';
import { WebcamHud } from './components/WebcamHud';
import { ScienceDiagram } from './components/ScienceDiagram';
import { QuizResults } from './components/QuizResults';
import { sound } from './utils/sound';
import {
  Sparkles,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Hand,
  MousePointer,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('gesture');
  const [isMuted, setIsMuted] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);

  const currentQuestion = SCIENCE_QUESTIONS[currentIndex];

  // Choice selection handler (triggered either by 1.5s gesture or mouse click)
  const handleSelectChoice = useCallback(
    (choice: 1 | 2 | 3 | 4) => {
      if (isAnswered || isFinished) return;

      const isCorrect = choice === currentQuestion.answer;
      setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: choice }));
      setIsAnswered(true);

      if (isCorrect) {
        sound.playCorrect();
      } else {
        sound.playWrong();
      }
    },
    [currentQuestion, isAnswered, isFinished]
  );

  // Next question
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < SCIENCE_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      sound.playTick();
    } else {
      setIsFinished(true);
    }
  }, [currentIndex]);

  // Hook for MediaPipe vision & gesture tracking
  const {
    videoRef,
    canvasRef,
    cameraStatus,
    errorMessage,
    gestureState,
    restartCamera
  } = useHandLandmarker({
    onChoiceConfirmed: handleSelectChoice,
    onNextQuestionConfirmed: handleNextQuestion,
    isAnswered,
    isEnabled: inputMode === 'gesture',
    holdDurationMs: 1500
  });

  // Sound mute toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setIsAnswered(false);
    setIsFinished(false);
    sound.playTick();
  };

  // Score calculation
  const currentScore = Object.entries(userAnswers).reduce((acc, [qId, ans]) => {
    const question = SCIENCE_QUESTIONS.find((q) => q.id === Number(qId));
    return question && question.answer === ans ? acc + 10 : acc;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. Header (Strict Top Bar Contract: Brand Wordmark - Progress/Category - Actions) */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-black text-base shadow-sm">
              S
            </span>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                사이언스 제스처 퀴즈
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation & Progress info */}
          <div className="hidden md:flex items-center gap-3 text-xs font-medium text-slate-400">
            <span>중학교 과학 4지선다</span>
            <span>·</span>
            <span className="text-cyan-400 font-mono font-semibold">
              문제 {currentIndex + 1} / {SCIENCE_QUESTIONS.length}
            </span>
            <span>·</span>
            <span className="text-emerald-400 font-mono font-semibold">
              현재 점수: {currentScore}점
            </span>
          </div>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Guide modal trigger */}
            <button
              type="button"
              onClick={() => setShowHowToModal(true)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title="제스처 사용법 보기"
              aria-label="제스처 사용법"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Sound toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isMuted ? '음소거 해제' : '음소거'}
              aria-label="소리 설정"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Restart button */}
            <button
              type="button"
              onClick={handleRestart}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">다시 시작</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {isFinished ? (
          <QuizResults
            questions={SCIENCE_QUESTIONS}
            userAnswers={userAnswers}
            onRestart={handleRestart}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Zone: Question Stage & Interactive Choices (7 cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Question Card */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col gap-4">
                {/* Question Metadata Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-semibold">
                      {currentQuestion.grade}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-semibold">
                      {currentQuestion.subject}
                    </span>
                    <span className="text-slate-300 font-medium">
                      {currentQuestion.title}
                    </span>
                  </div>

                  <div className="font-mono text-cyan-400 font-bold">
                    Q{currentIndex + 1} / {SCIENCE_QUESTIONS.length}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / SCIENCE_QUESTIONS.length) * 100}%`
                    }}
                  />
                </div>

                {/* Question Prompt */}
                <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mt-1">
                  {currentQuestion.prompt}
                </h2>

                {/* Scientific Visual Diagram (if present) */}
                {currentQuestion.diagramType && (
                  <div className="mt-1">
                    <ScienceDiagram type={currentQuestion.diagramType} />
                  </div>
                )}
              </div>

              {/* 4 Interactive Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.choices.map((choiceText, index) => {
                  const choiceNum = (index + 1) as 1 | 2 | 3 | 4;
                  const isCandidate =
                    inputMode === 'gesture' &&
                    gestureState.candidateChoice === choiceNum &&
                    !isAnswered;
                  const isUserPick = userAnswers[currentQuestion.id] === choiceNum;
                  const isCorrectAnswer = currentQuestion.answer === choiceNum;

                  // Styling state evaluation
                  let cardBorder = 'border-slate-800 hover:border-slate-700 bg-slate-900/80';
                  let badgeBg = 'bg-slate-800 text-slate-300 border-slate-700';

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      cardBorder = 'border-emerald-500/80 bg-emerald-950/40 shadow-lg shadow-emerald-950/50';
                      badgeBg = 'bg-emerald-500 text-white border-emerald-400';
                    } else if (isUserPick && !isCorrectAnswer) {
                      cardBorder = 'border-rose-500/80 bg-rose-950/40 shadow-lg shadow-rose-950/50';
                      badgeBg = 'bg-rose-500 text-white border-rose-400';
                    } else {
                      cardBorder = 'border-slate-800/40 bg-slate-950/40 opacity-60';
                    }
                  } else if (isCandidate) {
                    // Currently targeted by hand gesture!
                    cardBorder = 'border-cyan-400 bg-cyan-950/40 shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-500/30';
                    badgeBg = 'bg-cyan-500 text-white border-cyan-300';
                  }

                  return (
                    <button
                      key={choiceNum}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectChoice(choiceNum)}
                      className={`relative overflow-hidden p-4 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[92px] group ${cardBorder} ${
                        !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                      }`}
                    >
                      {/* Hold progress filling background */}
                      {isCandidate && !isAnswered && (
                        <div
                          className="absolute inset-0 bg-cyan-500/15 pointer-events-none transition-all duration-75"
                          style={{
                            width: `${gestureState.holdProgress * 100}%`
                          }}
                        />
                      )}

                      <div className="flex items-start gap-3 relative z-10">
                        {/* Number badge */}
                        <span
                          className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeBg}`}
                        >
                          {choiceNum}
                        </span>

                        <span className="text-sm font-medium text-slate-100 leading-snug">
                          {choiceText}
                        </span>
                      </div>

                      {/* Bottom status badge */}
                      <div className="mt-2 flex items-center justify-between text-xs relative z-10">
                        {isCandidate && !isAnswered && (
                          <div className="flex items-center gap-1.5 text-cyan-300 text-[11px] font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                            1.5초 유지 중 ({Math.round(gestureState.holdProgress * 100)}%)
                          </div>
                        )}

                        {isAnswered && isCorrectAnswer && (
                          <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4" /> 정답
                          </div>
                        )}

                        {isAnswered && isUserPick && !isCorrectAnswer && (
                          <div className="flex items-center gap-1 text-rose-400 font-bold text-xs">
                            <XCircle className="w-4 h-4" /> 내 선택 (오답)
                          </div>
                        )}

                        {!isCandidate && !isAnswered && (
                          <span className="text-[11px] text-slate-500 group-hover:text-slate-400">
                            {inputMode === 'gesture' ? `손가락 ${choiceNum}개 1.5초` : '클릭하여 선택'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation Panel (revealed immediately after question is answered) */}
              {isAnswered && (
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      {userAnswers[currentQuestion.id] === currentQuestion.answer ? (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                          정답입니다! (+10점)
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5 border border-rose-500/30">
                          <XCircle className="w-4 h-4" />
                          아쉽게 틀렸습니다. (정답: {currentQuestion.answer}번)
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className={`relative overflow-hidden px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                        gestureState.candidateChoice === 5
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-emerald-950/60'
                          : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white'
                      }`}
                    >
                      {/* Hold fill gauge on the button */}
                      {gestureState.candidateChoice === 5 && (
                        <div
                          className="absolute inset-0 bg-emerald-400/30 pointer-events-none transition-all duration-75"
                          style={{ width: `${gestureState.holdProgress * 100}%` }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {currentIndex < SCIENCE_QUESTIONS.length - 1 ? (
                          <>
                            <span>다음 문제</span>
                            {gestureState.candidateChoice === 5 ? (
                              <span className="text-emerald-200 font-mono text-[11px]">
                                (🖐️ {Math.round(gestureState.holdProgress * 100)}%)
                              </span>
                            ) : (
                              <span className="text-emerald-100 font-normal text-[11px]">
                                (🖐️ 손가락 5개 1.5초 또는 클릭)
                              </span>
                            )}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>최종 결과 보기</span>
                            {gestureState.candidateChoice === 5 ? (
                              <span className="text-emerald-200 font-mono text-[11px]">
                                (🖐️ {Math.round(gestureState.holdProgress * 100)}%)
                              </span>
                            ) : (
                              <span className="text-emerald-100 font-normal text-[11px]">
                                (🖐️ 손가락 5개 1.5초 또는 클릭)
                              </span>
                            )}
                            <Sparkles className="w-3.5 h-3.5" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Detailed explanation */}
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                    <strong className="text-cyan-400 block mb-1 font-semibold text-sm">
                      💡 정답 해설
                    </strong>
                    {currentQuestion.explanation}
                  </div>

                  {/* Concept card summary */}
                  <div className="text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <span className="font-semibold text-slate-200 block mb-1 text-sm">
                      📌 핵심 과학 개념: {currentQuestion.conceptCard.title}
                    </span>
                    <p className="text-slate-300 mb-2">{currentQuestion.conceptCard.summary}</p>
                    {currentQuestion.conceptCard.formula && (
                      <div className="p-2 bg-slate-900 rounded font-mono text-cyan-300 text-xs inline-block mb-2 border border-slate-800">
                        {currentQuestion.conceptCard.formula}
                      </div>
                    )}
                    {currentQuestion.conceptCard.keyPoints && (
                      <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                        {currentQuestion.conceptCard.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Zone: Live Camera HUD & Gesture Feedback (5 cols on desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <WebcamHud
                videoRef={videoRef}
                canvasRef={canvasRef}
                cameraStatus={cameraStatus}
                errorMessage={errorMessage}
                gestureState={gestureState}
                inputMode={inputMode}
                onToggleInputMode={setInputMode}
                onRetryCamera={restartCamera}
                isAnswered={isAnswered}
              />

              {/* Gesture Instructions Cheat Sheet Card */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-md flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Hand className="w-3.5 h-3.5 text-cyan-400" />
                    손가락 제스처 가이드
                  </span>
                  <span className="text-[11px] text-slate-500">1.5초 유지</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="text-slate-300 text-[11px]">1번 선지</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <span className="text-slate-300 text-[11px]">2번 선지 (V자)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <span className="text-slate-300 text-[11px]">3번 선지</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                      4
                    </span>
                    <span className="text-slate-300 text-[11px]">4번 선지</span>
                  </div>

                  <div className="col-span-2 sm:col-span-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-900 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs">
                      5
                    </span>
                    <span className="text-emerald-300 text-[11px] font-semibold">
                      손가락 5개: 다음 문제로 이동 ➔
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal pt-1">
                  💡 <strong>선지 선택</strong>: 손가락 1~4개 1.5초 유지 / <strong>다음 문제 넘어가기</strong>: 해설 화면에서 손가락 5개(손바닥)를 1.5초 유지하거나 버튼을 클릭하세요.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Guide Modal */}
      {showHowToModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                사이언스 제스처 퀴즈 이용 안내
              </h3>
              <button
                type="button"
                onClick={() => setShowHowToModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1 font-semibold text-sm">
                  1. 손가락 제스처로 4지선다 풀기
                </strong>
                웹캠 화면을 향해 손가락 1개, 2개, 3개, 4개를 펼치면 해당하는 번호의 선지가 활성화됩니다.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1 font-semibold text-sm">
                  2. 1.5초 유지 확정 시스템
                </strong>
                실수로 손을 움직여 오답이 선택되지 않도록, 해당 손가락 개수를 1.5초간 유지했을 때만 정답으로 최종 확정됩니다.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-emerald-400 block mb-1 font-semibold text-sm">
                  3. 손가락 5개로 다음 문제 넘어가기
                </strong>
                문제를 풀고 정답과 해설을 확인한 뒤, 웹캠에 손가락 5개(손바닥)를 1.5초간 펴고 있으면 자동으로 다음 문제(또는 최종 결과)로 넘어갑니다.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-cyan-400 block mb-1 font-semibold text-sm">
                  4. 마우스 클릭 대체 수단
                </strong>
                카메라 사용이 불가능하거나 손동작이 피로할 경우, 상단의 [마우스] 버튼을 누르거나 선지 및 [다음 문제] 버튼을 직접 클릭하여 언제든지 문제를 풀 수 있습니다.
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400 block mb-0.5 font-semibold">
                    5. 100% 브라우저 온디바이스 처리 (개인정보 보호)
                  </strong>
                  MediaPipe Vision 모델을 통해 브라우저 내부에서만 손가락을 분석하며, 영상 데이터는 외부 서버로 절대 전송되지 않습니다.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowToModal(false)}
              className="mt-2 w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>중학교 과학 교육과정 10문항 · 물리 · 화학 · 생명과학 · 지구과학</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            MediaPipe On-Device Vision Engine
          </span>
        </div>
      </footer>
    </div>
  );
}
