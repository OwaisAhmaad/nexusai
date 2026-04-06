'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

/* ── Types ──────────────────────────────────────────────────── */
interface MediaToolbarProps {
  onVoiceTranscript: (text: string) => void;
  onAttachFile?: (file: File) => void;
  onAttachImage?: (file: File, previewUrl: string) => void;
  showAgentPill?: boolean;
  submitLabel?: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

/* ── SVG icons ───────────────────────────────────────────────── */
function MicIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#EF4444' : 'none'} stroke={active ? '#EF4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
      <circle cx="9" cy="9" r="2"/>
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}

function VideoIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#E8521A' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 8-6 4 6 4V8z"/>
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
    </svg>
  );
}

function ScreenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#E8521A' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="15" x="2" y="3" rx="2"/>
      <polyline points="8 21 12 17 16 21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export function MediaToolbar({
  onVoiceTranscript,
  onAttachFile,
  onAttachImage,
  showAgentPill = true,
  submitLabel = "Let's go",
  onSubmit,
  submitDisabled = false,
}: MediaToolbarProps) {
  const [isListening, setIsListening] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [attachedImageUrl, setAttachedImageUrl] = useState<string | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showScreenModal, setShowScreenModal] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const screenPreviewRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  /* Bind streams to video elements */
  useEffect(() => {
    if (videoPreviewRef.current && videoStream) {
      videoPreviewRef.current.srcObject = videoStream;
    }
  }, [videoStream, showVideoModal]);

  useEffect(() => {
    if (screenPreviewRef.current && screenStream) {
      screenPreviewRef.current.srcObject = screenStream;
    }
  }, [screenStream, showScreenModal]);

  /* Cleanup streams on unmount */
  useEffect(() => {
    return () => {
      videoStream?.getTracks().forEach((t) => t.stop());
      screenStream?.getTracks().forEach((t) => t.stop());
      recognitionRef.current?.stop();
    };
  }, [videoStream, screenStream]);

  /* ── Voice input ── */
  const handleVoice = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    if (!SR) {
      setTooltip('Voice input not supported in this browser. Try Chrome.');
      setTimeout(() => setTooltip(null), 3000);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SR() as any;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join('');
      onVoiceTranscript(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening, onVoiceTranscript]);

  /* ── File attach ── */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFileName(file.name);
    onAttachFile?.(file);
    e.target.value = '';
  }

  /* ── Image attach ── */
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAttachedImageUrl(url);
    onAttachImage?.(file, url);
    e.target.value = '';
  }

  /* ── Video input ── */
  async function handleVideo() {
    if (videoStream) {
      videoStream.getTracks().forEach((t) => t.stop());
      setVideoStream(null);
      setShowVideoModal(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setVideoStream(stream);
      setShowVideoModal(true);
    } catch {
      setTooltip('Camera access denied or unavailable.');
      setTimeout(() => setTooltip(null), 3000);
    }
  }

  /* ── Screen share ── */
  async function handleScreenShare() {
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
      setScreenStream(null);
      setShowScreenModal(false);
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
      setScreenStream(stream);
      setShowScreenModal(true);
      // Auto-stop when user ends share
      stream.getTracks()[0]?.addEventListener('ended', () => {
        setScreenStream(null);
        setShowScreenModal(false);
      });
    } catch {
      // user cancelled
    }
  }

  /* ── Render ── */
  return (
    <>
      {/* Toolbar row */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-0.5">

          {/* 🎙 Voice */}
          <button
            type="button"
            onClick={handleVoice}
            title="Voice input"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              isListening
                ? 'bg-red-50 text-red-500 animate-pulse'
                : 'text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A]'
            }`}
          >
            <MicIcon active={isListening} />
          </button>

          {/* 📎 File */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition"
          >
            <PaperclipIcon />
          </button>

          {/* 🖼 Image */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            title="Upload image"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A] transition"
          >
            <ImageIcon />
          </button>

          {/* ✦ AI */}
          <button
            type="button"
            title="AI features"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#E8521A] transition"
          >
            <SparkleIcon />
          </button>

          {/* 📹 Video */}
          <button
            type="button"
            onClick={handleVideo}
            title={videoStream ? 'Stop camera' : 'Start camera'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              videoStream
                ? 'bg-orange-50 text-[#E8521A]'
                : 'text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A]'
            }`}
          >
            <VideoIcon active={!!videoStream} />
          </button>

          {/* 🖥 Screen share */}
          <button
            type="button"
            onClick={handleScreenShare}
            title={screenStream ? 'Stop sharing' : 'Share screen'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              screenStream
                ? 'bg-orange-50 text-[#E8521A]'
                : 'text-[#6B7280] hover:bg-[#F5F4F0] hover:text-[#1A1A1A]'
            }`}
          >
            <ScreenIcon active={!!screenStream} />
          </button>

          {/* Agent + pill */}
          {showAgentPill && (
            <Link
              href="/agents"
              className="flex items-center gap-1 border border-[#E5E5E5] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#374151] hover:border-[#E8521A] hover:text-[#E8521A] transition ml-1 whitespace-nowrap"
            >
              <span className="text-[12px]">◻</span> Agent +
            </Link>
          )}
        </div>

        {/* Submit button */}
        {onSubmit && (
          <button
            type="submit"
            onClick={onSubmit}
            disabled={submitDisabled}
            className="flex items-center gap-1.5 bg-[#E8521A] text-white px-4 py-2 rounded-full font-bold text-[13px] hover:bg-[#d04415] transition disabled:opacity-40 whitespace-nowrap flex-shrink-0"
          >
            <SearchIcon />
            {submitLabel}
          </button>
        )}
      </div>

      {/* Attachments preview bar */}
      {(attachedFileName || attachedImageUrl || isListening || videoStream || screenStream) && (
        <div className="flex items-center gap-2 px-4 pb-2 flex-wrap">
          {isListening && (
            <span className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium bg-red-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              Listening…
            </span>
          )}
          {attachedFileName && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#374151] bg-[#F5F4F0] px-2.5 py-1 rounded-full border border-[#E5E5E5]">
              📎 {attachedFileName}
              <button type="button" onClick={() => setAttachedFileName(null)} className="ml-1 text-[#9CA3AF] hover:text-[#E8521A]">✕</button>
            </span>
          )}
          {attachedImageUrl && (
            <div className="flex items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={attachedImageUrl} alt="preview" className="w-8 h-8 rounded-lg object-cover border border-[#E5E5E5]" />
              <span className="text-[11px] text-[#374151]">Image attached</span>
              <button type="button" onClick={() => setAttachedImageUrl(null)} className="text-[#9CA3AF] hover:text-[#E8521A] text-[11px]">✕</button>
            </div>
          )}
          {videoStream && (
            <button
              type="button"
              onClick={() => setShowVideoModal(true)}
              className="flex items-center gap-1.5 text-[11px] text-[#E8521A] font-medium bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8521A] animate-pulse" />
              Camera on — click to preview
            </button>
          )}
          {screenStream && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#E8521A] font-medium bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8521A] animate-pulse" />
              Sharing screen
            </span>
          )}
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div className="mx-4 mb-2 bg-[#1A1A1A] text-white text-[12px] px-3 py-2 rounded-xl">
          {tooltip}
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

      {/* Video preview modal */}
      {showVideoModal && videoStream && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowVideoModal(false)}>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[13px] font-semibold">Camera Preview</span>
              </div>
              <button type="button" onClick={() => setShowVideoModal(false)} className="text-white/60 hover:text-white text-lg">✕</button>
            </div>
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-md aspect-video object-cover"
            />
            <div className="flex gap-2 p-3">
              <button
                type="button"
                onClick={() => { videoStream.getTracks().forEach((t) => t.stop()); setVideoStream(null); setShowVideoModal(false); }}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-[13px] font-semibold hover:bg-red-600 transition"
              >
                Stop Camera
              </button>
              <button type="button" onClick={() => setShowVideoModal(false)} className="flex-1 bg-white/10 text-white py-2 rounded-xl text-[13px] font-semibold hover:bg-white/20 transition">
                Hide Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen share preview modal */}
      {showScreenModal && screenStream && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowScreenModal(false)}>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8521A] animate-pulse" />
                <span className="text-white text-[13px] font-semibold">Screen Share Active</span>
              </div>
              <button type="button" onClick={() => setShowScreenModal(false)} className="text-white/60 hover:text-white text-lg">✕</button>
            </div>
            <video
              ref={screenPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-contain bg-black"
            />
            <div className="flex gap-2 p-3">
              <button
                type="button"
                onClick={() => { screenStream.getTracks().forEach((t) => t.stop()); setScreenStream(null); setShowScreenModal(false); }}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl text-[13px] font-semibold hover:bg-red-600 transition"
              >
                Stop Sharing
              </button>
              <button type="button" onClick={() => setShowScreenModal(false)} className="flex-1 bg-white/10 text-white py-2 rounded-xl text-[13px] font-semibold hover:bg-white/20 transition">
                Hide Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
