import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { CameraStatus, ExtendedFingers, GestureDetectionState } from '../types';
import { sound } from '../utils/sound';

interface UseHandLandmarkerOptions {
  onChoiceConfirmed?: (choice: 1 | 2 | 3 | 4) => void;
  onNextQuestionConfirmed?: () => void;
  isAnswered?: boolean;
  isEnabled?: boolean;
  holdDurationMs?: number; // default 1500ms
}

interface Landmark {
  x: number;
  y: number;
  z?: number;
}

// MediaPipe Hand Connection lines
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm base
  [5, 9], [9, 13], [13, 17]
];

function dist(p1: Landmark, p2: Landmark): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function useHandLandmarker({
  onChoiceConfirmed,
  onNextQuestionConfirmed,
  isAnswered = false,
  isEnabled = true,
  holdDurationMs = 1500
}: UseHandLandmarkerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [gestureState, setGestureState] = useState<GestureDetectionState>({
    isHandPresent: false,
    fingerCount: 0,
    extendedFingers: { thumb: false, index: false, middle: false, ring: false, pinky: false },
    candidateChoice: null,
    actionType: null,
    holdProgress: 0,
    holdRemainingSeconds: 1.5,
    isHoldCompleted: false
  });

  // Hold tracking refs to maintain continuous state between animation frames
  const holdCandidateRef = useRef<1 | 2 | 3 | 4 | 5 | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const holdTriggeredRef = useRef<boolean>(false);
  const onChoiceConfirmedRef = useRef(onChoiceConfirmed);
  onChoiceConfirmedRef.current = onChoiceConfirmed;
  const onNextQuestionConfirmedRef = useRef(onNextQuestionConfirmed);
  onNextQuestionConfirmedRef.current = onNextQuestionConfirmed;
  const isAnsweredRef = useRef(isAnswered);
  isAnsweredRef.current = isAnswered;

  // Reset hold state whenever isAnswered changes
  useEffect(() => {
    holdCandidateRef.current = null;
    holdStartTimeRef.current = null;
    holdTriggeredRef.current = false;
    sound.stopHoldTone();
    setGestureState((prev) => ({
      ...prev,
      candidateChoice: null,
      actionType: null,
      holdProgress: 0,
      holdRemainingSeconds: holdDurationMs / 1000,
      isHoldCompleted: false
    }));
  }, [isAnswered, holdDurationMs]);

  // Initialize MediaPipe Vision Tasks
  const initMediaPipe = useCallback(async () => {
    try {
      setCameraStatus('loading_engine');
      setErrorMessage(null);

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      // Attempt GPU delegate first, fallback to CPU
      let landmarker: HandLandmarker;
      try {
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        });
      } catch (gpuError) {
        console.warn('GPU delegate failed, falling back to CPU delegate:', gpuError);
        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        });
      }

      landmarkerRef.current = landmarker;
      return true;
    } catch (err: unknown) {
      console.error('MediaPipe initialization failed:', err);
      setCameraStatus('engine_error');
      setErrorMessage(
        'AI 비전 엔진을 불러오는 중 오류가 발생했습니다. 네트워크 환경을 확인하시거나 마우스 클릭 모드로 진행해 주세요.'
      );
      return false;
    }
  }, []);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('permission_denied');
      setErrorMessage('이 브라우저는 카메라(웹캠) 접근을 지원하지 않습니다. 마우스 클릭 모드를 사용해 주세요.');
      return;
    }

    try {
      setCameraStatus('requesting_camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(console.error);
          setCameraStatus('ready');
        };
      }
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      const error = err as Error;
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraStatus('permission_denied');
        setErrorMessage(
          '카메라 접근 권한이 허용되지 않았습니다. 브라우저 주소창 좌측의 설정/자물쇠 아이콘에서 카메라를 허용하거나, 편리한 마우스 클릭 모드를 이용해 주세요.'
        );
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraStatus('no_camera_found');
        setErrorMessage('연결된 카메라 장치를 찾을 수 없습니다. 마우스 모드로 퀴즈를 풀어보세요.');
      } else {
        setCameraStatus('permission_denied');
        setErrorMessage(`카메라를 시작할 수 없습니다 (${error.message || '오류'}). 마우스 모드를 이용해 주세요.`);
      }
    }
  }, []);

  // Stop Camera Stream
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    sound.stopHoldTone();
  }, []);

  // Calculate extended fingers
  const evaluateFingers = (landmarks: Landmark[]): { count: number; extended: ExtendedFingers } => {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const indexMcp = landmarks[5];
    const indexPip = landmarks[6];
    const indexTip = landmarks[8];
    const middlePip = landmarks[10];
    const middleTip = landmarks[12];
    const ringPip = landmarks[14];
    const ringTip = landmarks[16];
    const pinkyMcp = landmarks[17];
    const pinkyPip = landmarks[18];
    const pinkyTip = landmarks[20];

    // Fingers extension logic:
    // A finger is extended if tip is noticeably further from wrist than PIP joint
    const indexExtended = dist(indexTip, wrist) > dist(indexPip, wrist) * 1.15;
    const middleExtended = dist(middleTip, wrist) > dist(middlePip, wrist) * 1.15;
    const ringExtended = dist(ringTip, wrist) > dist(ringPip, wrist) * 1.15;
    const pinkyExtended = dist(pinkyTip, wrist) > dist(pinkyPip, wrist) * 1.15;

    // Thumb extension:
    // Distance from thumb tip to pinky MCP vs thumb IP to pinky MCP
    // Or distance between thumb tip and index MCP
    const thumbExtended = dist(thumbTip, pinkyMcp) > dist(thumbIp, pinkyMcp) * 1.18 &&
                          dist(thumbTip, indexMcp) > dist(indexPip, indexMcp) * 0.9;

    const extended: ExtendedFingers = {
      thumb: thumbExtended,
      index: indexExtended,
      middle: middleExtended,
      ring: ringExtended,
      pinky: pinkyExtended
    };

    // Calculate count
    // Standard Korean finger counting:
    // 1: Index extended (or only thumb)
    // 2: Index + Middle
    // 3: Index + Middle + Ring (or Thumb + Index + Middle)
    // 4: Index + Middle + Ring + Pinky (or Thumb + Index + Middle + Ring)
    let count = 0;
    if (extended.thumb) count++;
    if (extended.index) count++;
    if (extended.middle) count++;
    if (extended.ring) count++;
    if (extended.pinky) count++;

    return { count, extended };
  };

  // Draw hand landmarks on overlay canvas
  const drawHand = (
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark[],
    width: number,
    height: number,
    isConfirmed: boolean
  ) => {
    ctx.clearRect(0, 0, width, height);

    // Set mirror transform so user sees themselves like a mirror
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);

    // Draw connection lines
    ctx.lineWidth = 3;
    ctx.strokeStyle = isConfirmed ? '#10b981' : '#06b6d4'; // emerald or cyan glow
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    }

    // Draw landmark joint nodes
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const isTip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;

      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, isTip ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = isTip
        ? isConfirmed ? '#34d399' : '#38bdf8'
        : '#ffffff';
      ctx.fill();

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isConfirmed ? '#065f46' : '#0369a1';
      ctx.stroke();
    }

    ctx.restore();
  };

  // Main processing loop
  useEffect(() => {
    if (!isEnabled) {
      stopCamera();
      return;
    }

    let isSubscribed = true;

    const setup = async () => {
      const engineOk = await initMediaPipe();
      if (engineOk && isSubscribed) {
        await startCamera();
      }
    };

    setup();

    return () => {
      isSubscribed = false;
      stopCamera();
    };
  }, [isEnabled, initMediaPipe, startCamera, stopCamera]);

  // Frame detection loop
  useEffect(() => {
    if (cameraStatus !== 'ready' || !isEnabled) return;

    let lastVideoTime = -1;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (video && canvas && landmarker && video.readyState >= 2) {
        const currentTime = video.currentTime;
        if (currentTime !== lastVideoTime) {
          lastVideoTime = currentTime;

          // Sync canvas resolution
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          }

          const ctx = canvas.getContext('2d');
          const results = landmarker.detectForVideo(video, performance.now());

          if (results.landmarks && results.landmarks.length > 0) {
            const hand = results.landmarks[0] as Landmark[];
            const { count, extended } = evaluateFingers(hand);

            // Determine candidate choice or next question action
            let candidate: 1 | 2 | 3 | 4 | 5 | null = null;
            let action: 'select_choice' | 'next_question' | null = null;

            if (isAnsweredRef.current) {
              // Question answered: 5 fingers triggers moving to Next Question
              if (count === 5) {
                candidate = 5;
                action = 'next_question';
              }
            } else {
              // Solving question: 1~4 fingers triggers choice selection
              if (count >= 1 && count <= 4) {
                candidate = count as 1 | 2 | 3 | 4;
                action = 'select_choice';
              }
            }

            const now = performance.now();

            if (candidate !== null) {
              if (holdCandidateRef.current === candidate) {
                // Continuation of holding the same candidate
                const elapsed = now - (holdStartTimeRef.current || now);
                const progress = Math.min(1, elapsed / holdDurationMs);
                const remaining = Math.max(0, (holdDurationMs - elapsed) / 1000);

                sound.updateHoldTone(progress);

                if (elapsed >= holdDurationMs && !holdTriggeredRef.current) {
                  holdTriggeredRef.current = true;
                  sound.playConfirm();
                  if (candidate === 5) {
                    if (onNextQuestionConfirmedRef.current) {
                      onNextQuestionConfirmedRef.current();
                    }
                  } else {
                    if (onChoiceConfirmedRef.current) {
                      onChoiceConfirmedRef.current(candidate);
                    }
                  }
                }

                setGestureState({
                  isHandPresent: true,
                  fingerCount: count,
                  extendedFingers: extended,
                  candidateChoice: candidate,
                  actionType: action,
                  holdProgress: progress,
                  holdRemainingSeconds: Number(remaining.toFixed(1)),
                  isHoldCompleted: holdTriggeredRef.current
                });
              } else {
                // Changed candidate or started fresh hold
                holdCandidateRef.current = candidate;
                holdStartTimeRef.current = now;
                holdTriggeredRef.current = false;
                sound.playTick();
                sound.stopHoldTone();

                setGestureState({
                  isHandPresent: true,
                  fingerCount: count,
                  extendedFingers: extended,
                  candidateChoice: candidate,
                  actionType: action,
                  holdProgress: 0,
                  holdRemainingSeconds: holdDurationMs / 1000,
                  isHoldCompleted: false
                });
              }
            } else {
              // No valid action candidate for current state
              if (holdCandidateRef.current !== null) {
                sound.stopHoldTone();
              }
              holdCandidateRef.current = null;
              holdStartTimeRef.current = null;
              holdTriggeredRef.current = false;

              setGestureState({
                isHandPresent: true,
                fingerCount: count,
                extendedFingers: extended,
                candidateChoice: null,
                actionType: null,
                holdProgress: 0,
                holdRemainingSeconds: holdDurationMs / 1000,
                isHoldCompleted: false
              });
            }

            if (ctx) {
              drawHand(ctx, hand, canvas.width, canvas.height, holdTriggeredRef.current);
            }
          } else {
            // No hand detected
            if (holdCandidateRef.current !== null) {
              sound.stopHoldTone();
            }
            holdCandidateRef.current = null;
            holdStartTimeRef.current = null;
            holdTriggeredRef.current = false;

            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            setGestureState((prev) => ({
              ...prev,
              isHandPresent: false,
              fingerCount: 0,
              candidateChoice: null,
              actionType: null,
              holdProgress: 0,
              holdRemainingSeconds: holdDurationMs / 1000,
              isHoldCompleted: false
            }));
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      sound.stopHoldTone();
    };
  }, [cameraStatus, isEnabled, holdDurationMs]);

  // Restart camera action
  const restartCamera = useCallback(async () => {
    stopCamera();
    await startCamera();
  }, [stopCamera, startCamera]);

  return {
    videoRef,
    canvasRef,
    cameraStatus,
    errorMessage,
    gestureState,
    restartCamera
  };
}
