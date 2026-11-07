import React, { useEffect } from 'react';
import { Question } from '../types';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, RotateCcw, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';

interface QuizResultsProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  userAnswers,
  onRestart
}) => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.answer) {
      correctCount++;
    }
  });

  const totalScore = correctCount * 10;
  const accuracy = Math.round((correctCount / questions.length) * 100);

  // Subject statistics
  const subjectStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q) => {
    if (!subjectStats[q.subject]) {
      subjectStats[q.subject] = { total: 0, correct: 0 };
    }
    subjectStats[q.subject].total++;
    if (userAnswers[q.id] === q.answer) {
      subjectStats[q.subject].correct++;
    }
  });

  // Launch celebratory confetti and victory sound
  useEffect(() => {
    sound.playVictory();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
      return () => clearTimeout(timer);
    } catch {
      // Confetti fallback
    }
  }, []);

  // Title badge
  let rankBadge = { title: '🏆 과학 영재 탐구왕', desc: '완벽한 과학적 사고력과 뛰어난 이해도를 보여주셨습니다!' };
  if (totalScore >= 80 && totalScore < 100) {
    rankBadge = { title: '🔬 마스터 과학 탐구자', desc: '중학교 과학 개념을 훌륭하게 마스터했습니다!' };
  } else if (totalScore >= 60 && totalScore < 80) {
    rankBadge = { title: '⚡ 열정적인 미래 과학자', desc: '기본 개념이 탄탄합니다! 오답 해설을 꼼꼼히 확인해 보세요.' };
  } else if (totalScore < 60) {
    rankBadge = { title: '🌱 차근차근 탐구 새싹', desc: '과학은 실수를 통해 배웁니다. 해설 노트를 확인하고 다시 도전해 보세요!' };
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Hero Score Card */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl text-center flex flex-col items-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
          <Award className="w-9 h-9" />
        </div>

        <div className="text-sm font-semibold tracking-wide text-cyan-400 uppercase">
          Quiz Completed
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
          {rankBadge.title}
        </h2>

        <p className="text-sm text-slate-400 mt-2 max-w-md">
          {rankBadge.desc}
        </p>

        {/* Score Number Display */}
        <div className="flex items-baseline justify-center gap-2 mt-6">
          <span className="text-6xl sm:text-7xl font-extrabold text-cyan-400 font-mono tracking-tight">
            {totalScore}
          </span>
          <span className="text-2xl font-bold text-slate-500 font-mono">/ 100점</span>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 mt-2 font-mono">
          <span>정답 {correctCount}문제</span>
          <span>·</span>
          <span>오답 {questions.length - correctCount}문제</span>
          <span>·</span>
          <span className="text-emerald-400 font-bold">정답률 {accuracy}%</span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onRestart}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          처음부터 다시 도전하기
        </button>
      </div>

      {/* Domain Breakdown Grid */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          영역별 성취도 분석
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(subjectStats).map(([sub, stat]) => {
            const pct = Math.round((stat.correct / stat.total) * 100);
            return (
              <div
                key={sub}
                className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-1.5"
              >
                <span className="text-xs font-semibold text-slate-400">{sub}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-bold text-slate-100 font-mono">
                    {stat.correct}/{stat.total}
                  </span>
                  <span className="text-xs font-mono font-semibold text-cyan-400">
                    {pct}%
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete 10 Questions Review */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            10문제 전체 정답 및 해설 노트
          </h3>
          <span className="text-xs text-slate-400">카드를 눌러 해설을 펼치세요</span>
        </div>

        <div className="flex flex-col gap-3">
          {questions.map((q, idx) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.answer;
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isCorrect
                    ? 'bg-slate-950/60 border-emerald-950/60 hover:border-emerald-700/60'
                    : 'bg-slate-950/60 border-rose-950/60 hover:border-rose-700/60'
                }`}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{q.grade}</span>
                        <span>·</span>
                        <span>{q.subject}</span>
                        <span>·</span>
                        <span>{q.title}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-200 mt-0.5 line-clamp-1">
                        {q.prompt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 정답
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> 오답 (선택: {userAnswer || '미선택'}번)
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 bg-slate-900/40 flex flex-col gap-3 text-xs">
                    {/* Choices recap */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {q.choices.map((choice, cIdx) => {
                        const num = (cIdx + 1) as 1 | 2 | 3 | 4;
                        const isThisAnswer = num === q.answer;
                        const isThisUserPick = num === userAnswer;

                        return (
                          <div
                            key={cIdx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              isThisAnswer
                                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-semibold'
                                : isThisUserPick && !isCorrect
                                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-mono font-bold">{num}.</span>
                              <span>{choice}</span>
                            </span>
                            {isThisAnswer && <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">정답</span>}
                            {isThisUserPick && !isThisAnswer && <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300">내 선택</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/40 text-slate-300 leading-relaxed">
                      <strong className="text-cyan-400 block mb-1 font-semibold">💡 정답 해설</strong>
                      {q.explanation}
                    </div>

                    {/* Concept Card */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                      <div className="font-semibold text-slate-200 mb-1">
                        📌 {q.conceptCard.title}
                      </div>
                      <p className="text-slate-300">{q.conceptCard.summary}</p>
                      {q.conceptCard.formula && (
                        <div className="mt-1.5 font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded inline-block">
                          {q.conceptCard.formula}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
