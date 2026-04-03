'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

/* ─── TypeScript declarations ───────────────────────────────── */
interface SpeechRecognitionResultItem {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResultEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

/* ─── Props ──────────────────────────────────────────────────── */
interface ChatToolbarProps {
  onTranscript: (text: string) => void;
  onFilesChange: (files: File[]) => void;
  chatInput: string;
  onSubmit: () => void;
  selectedModelName?: string;
}

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[12px] px-4 py-2 rounded-full z-50 animate-pulse pointer-events-none whitespace-nowrap">
      {message}
    </div>
  );
}

/* ─── Icon button ────────────────────────────────────────────── */
function ToolBtn({
  label,
  active,
  onClick,
  children,
  title,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title ?? label}
      onClick={onClick}
      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition text-[15px] ${
        active
          ? 'border-red-300 text-red-500 bg-red-50'
          : 'border-[#E5E5E5] bg-white text-[#6B7280] hover:border-[#E8521A]/40 hover:text-[#E8521A]'
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export function ChatToolbar({
  onTranscript,
  onFilesChange,
  chatInput,
  onSubmit,
  selectedModelName,
}: ChatToolbarProps) {
  /* Toast */
  const [toast, setToast] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => setToast(msg), []);

  /* ── 1. Voice ── */
  const [voiceActive, setVoiceActive] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  function startVoice() {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      showToast('Voice input not supported in this browser');
      return;
    }
    const rec = new SpeechRecognitionCtor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event: SpeechRecognitionResultEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript);
    };
    rec.onerror = () => {
      showToast('Voice input not supported in this browser');
      setVoiceActive(false);
    };
    rec.onend = () => setVoiceActive(false);
    rec.start();
    recognitionRef.current = rec;
    setVoiceActive(true);
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setVoiceActive(false);
  }

  function toggleVoice() {
    if (voiceActive) stopVoice();
    else startVoice();
  }

  /* ── 2. File select ── */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const combined = [...attachedFiles, ...picked];
    if (combined.length > 5) {
      setFileError('Max 5 files allowed');
      const allowed = combined.slice(0, 5);
      setAttachedFiles(allowed);
      onFilesChange(allowed);
      e.target.value = '';
      return;
    }
    const oversize = picked.find((f) => f.size > 10 * 1024 * 1024);
    if (oversize) {
      setFileError(`${oversize.name} exceeds 10 MB`);
      e.target.value = '';
      return;
    }
    setFileError(null);
    setAttachedFiles(combined);
    onFilesChange(combined);
    e.target.value = '';
  }

  function removeFile(index: number) {
    const next = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(next);
    onFilesChange(next);
    setFileError(null);
  }

  /* ── 3. Camera ── */
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraCapture, setCameraCapture] = useState<string | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Camera not available in this browser');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStreamRef.current = stream;
      setCameraOpen(true);
      setCameraCapture(null);
      // Assign stream after modal renders
      setTimeout(() => {
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
        }
      }, 50);
    } catch {
      showToast('Camera permission denied');
    }
  }

  function closeCamera() {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    setCameraOpen(false);
    setCameraCapture(null);
  }

  function captureSnapshot() {
    const video = cameraVideoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setCameraCapture(dataUrl);
    setTimeout(() => setCameraCapture(null), 2000);
  }

  /* ── 4. Audio recording ── */
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [audioChips, setAudioChips] = useState<{ url: string; duration: number }[]>([]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('Audio recording not available in this browser');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      const startSeconds = 0;
      let elapsed = startSeconds;
      recorder.onstart = () => {
        elapsed = 0;
        setAudioSeconds(0);
        audioTimerRef.current = setInterval(() => {
          elapsed += 1;
          setAudioSeconds(elapsed);
        }, 1000);
      };
      recorder.onstop = () => {
        if (audioTimerRef.current) {
          clearInterval(audioTimerRef.current);
          audioTimerRef.current = null;
        }
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioChips((prev) => [...prev, { url, duration: elapsed }]);
        setAudioRecording(false);
        setAudioSeconds(0);
        audioStreamRef.current?.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      };
      recorder.start();
      recorderRef.current = recorder;
      setAudioRecording(true);
    } catch {
      showToast('Microphone permission denied');
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
  }

  function toggleRecording() {
    if (audioRecording) stopRecording();
    else startRecording();
  }

  function removeAudioChip(index: number) {
    setAudioChips((prev) => prev.filter((_, i) => i !== index));
  }

  function formatDuration(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  /* ── 5. Screen share ── */
  const [screenSharing, setScreenSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  async function startScreenShare() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      showToast('Screen sharing not available in this browser');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      screenStreamRef.current = stream;
      setScreenSharing(true);
      stream.getVideoTracks()[0].onended = stopScreenShare;
      setTimeout(() => {
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }
      }, 50);
    } catch {
      showToast('Screen share permission denied');
    }
  }

  function stopScreenShare() {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setScreenSharing(false);
  }

  /* ── 6. Image select ── */
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [attachedImages, setAttachedImages] = useState<{ file: File; preview: string }[]>([]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const combined = [...attachedImages];
    for (const file of picked) {
      if (combined.length >= 4) {
        showToast('Max 4 images allowed');
        break;
      }
      const preview = URL.createObjectURL(file);
      combined.push({ file, preview });
    }
    setAttachedImages(combined);
    e.target.value = '';
  }

  function removeImage(index: number) {
    setAttachedImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      attachedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
    // intentionally run only on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Render ─────────────────────────────────────────────── */
  const hasAttachments =
    attachedFiles.length > 0 ||
    attachedImages.length > 0 ||
    audioChips.length > 0 ||
    fileError !== null;

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Audio recording pill */}
      {audioRecording && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-red-200 shadow-md px-4 py-2 rounded-full z-50">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[12px] font-semibold text-red-600">
            Recording {formatDuration(audioSeconds)}
          </span>
        </div>
      )}

      {/* Screen share thumbnail */}
      {screenSharing && (
        <div className="fixed bottom-24 right-4 z-50 bg-white rounded-2xl border border-[#E5E5E5] shadow-xl overflow-hidden w-60">
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full block"
          />
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#1A1A1A]">Sharing screen</span>
            <button
              type="button"
              onClick={stopScreenShare}
              className="text-[11px] text-red-500 font-semibold hover:underline"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed bottom-24 right-4 z-50 bg-white rounded-2xl border border-[#E5E5E5] shadow-xl overflow-hidden w-[280px]">
          <div className="relative bg-black">
            <video
              ref={cameraVideoRef}
              autoPlay
              muted
              className="w-full block"
            />
            {cameraCapture && (
              <img
                src={cameraCapture}
                alt="Snapshot"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}
          </div>
          <div className="px-3 py-2 flex items-center gap-2">
            <button
              type="button"
              onClick={captureSnapshot}
              className="flex-1 bg-[#E8521A] text-white text-[12px] font-semibold px-3 py-1.5 rounded-full hover:bg-[#d04415] transition"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="border border-[#E5E5E5] text-[#6B7280] text-[12px] font-medium px-3 py-1.5 rounded-full hover:border-[#1A1A1A] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Attachment chips row */}
      {hasAttachments && (
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          {/* File chips */}
          {attachedFiles.map((f, i) => (
            <span
              key={`${f.name}-${i}`}
              className="flex items-center gap-1 text-[11px] bg-[#F5F4F0] border border-[#E5E5E5] px-2 py-1 rounded-full text-[#1A1A1A]"
            >
              <span>📄</span>
              <span className="max-w-[120px] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-[#6B7280] hover:text-red-500 ml-0.5 leading-none"
              >
                ×
              </button>
            </span>
          ))}

          {/* File error chip */}
          {fileError && (
            <span className="flex items-center gap-1 text-[11px] bg-red-50 border border-red-200 px-2 py-1 rounded-full text-red-600">
              ⚠ {fileError}
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="hover:text-red-800 ml-0.5 leading-none"
              >
                ×
              </button>
            </span>
          )}

          {/* Audio chips */}
          {audioChips.map((chip, i) => (
            <span
              key={`audio-${i}`}
              className="flex items-center gap-1 text-[11px] bg-[#F5F4F0] border border-[#E5E5E5] px-2 py-1 rounded-full text-[#1A1A1A]"
            >
              <button
                type="button"
                onClick={() => {
                  const a = new Audio(chip.url);
                  a.play();
                }}
                className="flex items-center gap-1 hover:text-[#E8521A]"
                title="Play recording"
              >
                <span>🎵</span>
                <span>Recording ({formatDuration(chip.duration)})</span>
              </button>
              <button
                type="button"
                onClick={() => removeAudioChip(i)}
                className="text-[#6B7280] hover:text-red-500 ml-0.5 leading-none"
              >
                ×
              </button>
            </span>
          ))}

          {/* Image thumbnails */}
          {attachedImages.map((img, i) => (
            <span key={`img-${i}`} className="relative inline-block">
              <img
                src={img.preview}
                alt={img.file.name}
                className="w-12 h-12 rounded-lg object-cover border border-[#E5E5E5]"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-[#E5E5E5] text-[10px] text-[#6B7280] hover:text-red-500 flex items-center justify-center leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Toolbar row */}
      <div className="flex items-center justify-between px-1">
        {/* Left: icon buttons */}
        <div className="flex items-center gap-1">
          {/* 1. Voice */}
          <ToolBtn
            label="Voice typing"
            active={voiceActive}
            onClick={toggleVoice}
            title={voiceActive ? 'Listening… (click to stop)' : 'Voice typing'}
          >
            🎙
          </ToolBtn>

          {/* 2. File */}
          <ToolBtn
            label="Attach file"
            onClick={() => fileInputRef.current?.click()}
            title="Attach files (max 5, 10 MB each)"
          >
            📁
          </ToolBtn>

          {/* 3. Camera */}
          <ToolBtn
            label="Camera"
            active={cameraOpen}
            onClick={cameraOpen ? closeCamera : openCamera}
            title="Open camera"
          >
            📹
          </ToolBtn>

          {/* 4. Audio recording */}
          <ToolBtn
            label="Record audio"
            active={audioRecording}
            onClick={toggleRecording}
            title={audioRecording ? 'Stop recording' : 'Record audio'}
          >
            🔊
          </ToolBtn>

          {/* 5. Screen share */}
          <ToolBtn
            label="Screen share"
            active={screenSharing}
            onClick={screenSharing ? stopScreenShare : startScreenShare}
            title={screenSharing ? 'Stop sharing' : 'Share screen'}
          >
            🖥
          </ToolBtn>

          {/* 6. Image select */}
          <ToolBtn
            label="Attach image"
            onClick={() => imageInputRef.current?.click()}
            title="Attach images (max 4)"
          >
            🖼
          </ToolBtn>
        </div>

        {/* Right: model pill + submit */}
        <div className="flex items-center gap-2">
          <Link
            href="/marketplace"
            className="flex items-center gap-1 text-[11px] text-[#6B7280] border border-[#E5E5E5] px-2.5 py-1 rounded-full hover:border-[#9CA3AF] transition"
          >
            All models →
          </Link>

          <div className="flex items-center gap-1 text-[11px] text-[#6B7280] border border-[#E5E5E5] px-2.5 py-1 rounded-full cursor-pointer hover:border-[#9CA3AF] transition">
            {selectedModelName ?? 'GPT-5.4'}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="bg-[#E8521A] text-white px-5 py-2 rounded-full font-semibold text-[13px] hover:bg-[#d04415] transition"
          >
            Let&apos;s go →
          </button>
        </div>
      </div>
    </>
  );
}
