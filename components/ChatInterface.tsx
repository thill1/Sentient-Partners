import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Mic, Play, MicOff, Radio, Maximize2, Minimize2, AlertCircle, X, ChevronDown, MessageSquare, Download, Wifi } from 'lucide-react';
import { Message } from '../types';
import { 
  sendMessageToGemini, 
  connectLiveSession, 
  createPcmBlob, 
  decode, 
  decodeAudioData,
  sendTranscript,
  sendTestEmail,
  dispatchToast
} from '../services/geminiService';
import { LiveServerMessage } from "@google/genai";

const SUGGESTED_ACTIONS = [
  { label: "Book Appointment", prompt: "I'd like to book a strategy call." },
  { label: "Pricing Info", prompt: "How much does it cost to set up an AI receptionist?" },
  { label: "Tokyo Time?", prompt: "What time is it in Tokyo right now?" },
  { label: "Sky Color?", prompt: "Why is the sky blue? Explain simply." }
];

export const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Text Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: "Hello. I am the Sentient AI interface. I have access to real-time data and can demonstrate how our systems automate your revenue growth. How may I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Voice State & Transcription
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  
  // Transcription History
  const [transcriptHistory, setTranscriptHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const currentInputTransRef = useRef('');
  const currentOutputTransRef = useRef('');

  // Refs
  const sessionRef = useRef<any>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);

  // Listen for global open event
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-sentient-chat', handleOpenEvent);
    
    // Check environment on mount
    if (window.location.protocol === 'file:') {
       setTimeout(() => {
         dispatchToast("Running in local file mode. Email & Voice features require a local server.", "error");
       }, 1500);
    }

    return () => window.removeEventListener('open-sentient-chat', handleOpenEvent);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, activeTab, isLoading, isOpen]);

  // Clean up Live API on unmount or tab switch
  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'voice' || !isOpen) {
      stopLiveSession();
    }
  }, [activeTab, isOpen]);

  // Logic to prepare transcript data
  const prepareTranscriptData = () => {
    // 1. Capture pending transcripts from Refs (chunks that haven't hit turnComplete)
    const pendingUser = currentInputTransRef.current.trim();
    const pendingModel = currentOutputTransRef.current.trim();

    // 2. Build Chat Log
    const chatLog = messages.length > 1 
      ? messages.map(m => `[${m.role.toUpperCase()}]: ${m.text}`).join('\n')
      : "";
    
    // 3. Build Voice Log (History + Pending)
    let voiceLog = transcriptHistory.map(t => `[VOICE ${t.role.toUpperCase()}]: ${t.text}`).join('\n');
    if (pendingUser) voiceLog += `\n[VOICE USER (Partial)]: ${pendingUser}`;
    if (pendingModel) voiceLog += `\n[VOICE MODEL (Partial)]: ${pendingModel}`;
    
    return { chatLog, voiceLog };
  };

  // Manual Save Handler
  const handleManualSave = async () => {
    if (isSaving) return;
    
    const { chatLog, voiceLog } = prepareTranscriptData();
    if (!chatLog && !voiceLog.trim()) {
      dispatchToast("No content to save yet.", "info");
      return;
    }

    setIsSaving(true);
    dispatchToast("Saving transcript...", "info");
    
    const result = await sendTranscript(chatLog, voiceLog);
    
    if (result.success) {
      // Already toasted in service
    } else {
      // Already toasted in service
    }
    setIsSaving(false);
  };

  const handleTestConnection = async () => {
    if (isSaving) return;
    setIsSaving(true);
    dispatchToast("Sending test packet...", "info");
    
    const result = await sendTestEmail();
    
    if (result.success) {
      dispatchToast("Success! Check your inbox.", "success");
    } else {
      dispatchToast(`Failed: ${result.message}`, "error");
    }
    
    setIsSaving(false);
  };

  // Handle Close & Send Transcript
  const handleClose = async () => {
    if (isSaving) return; // Prevent double clicks

    const { chatLog, voiceLog } = prepareTranscriptData();

    // Initial message is index 0, so length > 1 means user interacted
    const hasChat = messages.length > 1; 
    const hasVoice = voiceLog.trim().length > 0;

    if (hasChat || hasVoice) {
      setIsSaving(true);
      dispatchToast("Archiving session...", "info");

      // Auto-save logic
      await sendTranscript(chatLog, voiceLog);
      setIsSaving(false);
    }
    
    // Cleanup
    stopLiveSession();
    setIsOpen(false);
  };

  // Canvas Visualizer
  useEffect(() => {
    if (!isOpen || activeTab !== 'voice') return;

    let animId: number;
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    const bars = 64;
    const radiusBase = 80;
    let rotation = 0;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let dataArray = new Uint8Array(bars);
      if (analyzerRef.current && isLiveConnected) {
        const bufferLength = analyzerRef.current.frequencyBinCount;
        const fullData = new Uint8Array(bufferLength);
        analyzerRef.current.getByteFrequencyData(fullData);
        
        const step = Math.floor(bufferLength / bars);
        for(let i=0; i<bars; i++) {
            dataArray[i] = fullData[i * step];
        }
      }

      rotation += 0.005;
      
      for (let i = 0; i < bars; i++) {
        let barHeight = isLiveConnected 
             ? Math.max(4, dataArray[i] * 0.8)
             : 4 + Math.sin(i * 0.5 + rotation * 5) * 5;
             
        if (isVoiceLoading) {
            rotation += 0.02;
            barHeight = 15 + Math.sin(i * 0.5 + rotation * 15) * 10;
        }

        const rad = (i / bars) * Math.PI * 2 + rotation;
        const x1 = centerX + Math.cos(rad) * radiusBase;
        const y1 = centerY + Math.sin(rad) * radiusBase;
        const x2 = centerX + Math.cos(rad) * (radiusBase + barHeight);
        const y2 = centerY + Math.sin(rad) * (radiusBase + barHeight);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, '#0ea5e9'); // Sky blue
        gradient.addColorStop(1, '#a855f7'); // Purple
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [isLiveConnected, isVoiceLoading, activeTab, isOpen]);

  // --- Logic Implementations ---

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: responseId,
      role: 'model',
      text: '',
      isTyping: true,
      timestamp: new Date()
    }]);

    try {
      const stream = sendMessageToGemini(userMsg.text);
      let fullText = '';
      let hasReceivedText = false;

      for await (const chunk of stream) {
        hasReceivedText = true;
        fullText += chunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === responseId ? { ...msg, text: fullText.trim(), isTyping: false } : msg
        ));
      }

      if (!hasReceivedText) {
        setMessages(prev => prev.map(msg => 
          msg.id === responseId ? { ...msg, text: "I received your message.", isTyping: false } : msg
        ));
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === responseId ? { ...msg, text: "Connection error.", isTyping: false } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const startLiveSession = async () => {
    // Prevent starting live session if on file protocol
    if (window.location.protocol === 'file:') {
        dispatchToast("Microphone access blocked by browser on file:// protocol. Please use a local server.", "error");
        return;
    }

    setIsVoiceLoading(true);
    setVoiceError(null);
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      await inputCtx.resume();
      await outputCtx.resume();

      inputContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const analyzer = outputCtx.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      let stream: MediaStream;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error("Browser does not support audio input.");
        }
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e: any) {
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          throw new Error("Microphone permission denied.");
        } else {
           throw new Error("Microphone error. " + (e.message || ""));
        }
      }
      
      const sessionPromise = connectLiveSession({
        onopen: () => {
          setIsLiveConnected(true);
          setIsVoiceLoading(false);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            // Pass actual sample rate to prevent pitch issues
            const pcmBlob = createPcmBlob(inputData, inputCtx.sampleRate);
            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
          
          sourceNodeRef.current = source;
          scriptProcessorRef.current = processor;
        },
        onmessage: async (msg: LiveServerMessage) => {
          // 1. Audio Processing
          const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          
          if (base64Audio && outputContextRef.current) {
            const ctx = outputContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            
            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            
            if (analyzerRef.current) {
              source.connect(analyzerRef.current);
              analyzerRef.current.connect(ctx.destination);
            } else {
              source.connect(ctx.destination);
            }
            
            source.onended = () => {
              audioSourcesRef.current.delete(source);
              if (audioSourcesRef.current.size === 0) setIsPlayingAudio(false);
            };

            setIsPlayingAudio(true);
            audioSourcesRef.current.add(source);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
          }

          // 2. Transcription Handling
          const outputTrans = msg.serverContent?.outputTranscription?.text;
          const inputTrans = msg.serverContent?.inputTranscription?.text;

          if (outputTrans) {
            currentOutputTransRef.current += outputTrans;
          }
          if (inputTrans) {
            currentInputTransRef.current += inputTrans;
          }

          if (msg.serverContent?.turnComplete) {
             const userText = currentInputTransRef.current.trim();
             const modelText = currentOutputTransRef.current.trim();
             
             if (userText) setTranscriptHistory(prev => [...prev, {role: 'user', text: userText}]);
             if (modelText) setTranscriptHistory(prev => [...prev, {role: 'model', text: modelText}]);

             currentInputTransRef.current = '';
             currentOutputTransRef.current = '';
          }

          // 3. Interruption Handling
          if (msg.serverContent?.interrupted) {
            audioSourcesRef.current.forEach(src => { try { src.stop(); } catch(e) {} });
            audioSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
            setIsPlayingAudio(false);
            
            // Clear pending transcription if interrupted
            currentOutputTransRef.current = '';
          }
        },
        onclose: () => {
          setIsLiveConnected(false);
          setIsPlayingAudio(false);
        },
        onerror: (e) => {
          setIsVoiceLoading(false);
          setIsLiveConnected(false);
          setVoiceError("Connection failed.");
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (error: any) {
      setIsVoiceLoading(false);
      setIsLiveConnected(false);
      setVoiceError(error.message || "Connection failed.");
    }
  };

  const stopLiveSession = () => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }
    audioSourcesRef.current.forEach(src => { try { src.stop(); } catch(e) {} });
    audioSourcesRef.current.clear();

    // Finalize any partial transcripts
    if (currentInputTransRef.current) {
        setTranscriptHistory(prev => [...prev, {role: 'user', text: currentInputTransRef.current}]);
    }
    if (currentOutputTransRef.current) {
        setTranscriptHistory(prev => [...prev, {role: 'model', text: currentOutputTransRef.current}]);
    }
    currentInputTransRef.current = '';
    currentOutputTransRef.current = '';

    setIsLiveConnected(false);
    setIsVoiceLoading(false);
    setIsPlayingAudio(false);
    setVoiceError(null);
  };

  // --- Render ---

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-slate-900/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 text-white p-4 pr-6 rounded-full shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-brand-500/50 hover:bg-slate-900/80"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
             <Bot size={20} className="text-white" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-slate-900"></span>
          </span>
        </div>
        <div className="text-left">
          <p className="text-[10px] font-bold text-brand-300 uppercase tracking-widest leading-none mb-1">Sentient AI</p>
          <p className="text-sm font-semibold text-white/90 leading-none">Try the Demo</p>
        </div>
      </button>
    );
  }

  // Floating Window Container
  const containerClasses = isFullScreen 
    ? "fixed inset-0 z-[60] h-full w-full rounded-none" 
    : "fixed bottom-6 right-6 z-[60] w-[400px] h-[600px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] rounded-3xl";

  return (
    <>
      {/* Backdrop for mobile focus */}
      {!isFullScreen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] transition-opacity" 
          onClick={handleClose}
        />
      )}

      <div className={`${containerClasses} flex flex-col bg-white/95 dark:bg-dark-card/95 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden ring-1 ring-black/10 transition-all duration-300 animate-slide-up`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 p-4 shrink-0 bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Sentient <span className="text-brand-600 dark:text-brand-400">Intelligence</span></h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                System Online
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
               onClick={handleTestConnection}
               disabled={isSaving}
               className="p-2 text-slate-400 hover:text-green-600 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
               title="Test Email Connection"
            >
               <Wifi size={18} />
            </button>
            <button
               onClick={handleManualSave}
               disabled={isSaving}
               className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
               title="Save Transcript"
            >
               {isSaving ? <Loader2 size={18} className="animate-spin text-brand-500" /> : <Download size={18} />}
            </button>
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button 
              onClick={handleClose}
              disabled={isSaving}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait"
              title="Close & Save"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1.5 mx-4 mt-4 mb-2 bg-slate-100 dark:bg-black/40 rounded-xl shrink-0 border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'chat' 
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare size={16} /> Chat
          </button>
          <button 
            onClick={() => setActiveTab('voice')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'voice' 
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Radio size={16} className={isLiveConnected ? "animate-pulse" : ""} /> Voice
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-5 relative scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   {msg.role !== 'user' && (
                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/40 dark:to-purple-900/40 border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0 mb-1">
                       <Sparkles size={14} className="text-brand-600 dark:text-brand-400" />
                     </div>
                   )}
                   <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-600 text-white rounded-br-none shadow-brand-500/20' 
                        : 'bg-white/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-white/5 rounded-bl-none'
                    }`}>
                      {msg.text}
                      {msg.isTyping && <span className="inline-block w-1 h-3 ml-1 bg-current animate-pulse"/>}
                   </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 mask-gradient-right">
              {SUGGESTED_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 dark:hover:bg-white/10 dark:hover:text-white transition-all shadow-sm"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="p-4 bg-white dark:bg-black/20 border-t border-slate-100 dark:border-white/5 shrink-0">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:bg-white dark:focus:bg-black/40 focus:border-brand-500 rounded-xl outline-none text-sm text-slate-900 dark:text-white transition-all shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-500 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Voice Mode */
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 to-black dark:from-black dark:to-[#050505]">
            <canvas ref={visualizerCanvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none mix-blend-screen" />
            
            <div className="relative z-10 flex flex-col items-center p-6 text-center w-full">
              <div className="mb-10 relative">
                 {/* Glow Effect */}
                 <div className={`absolute inset-0 bg-brand-500 blur-3xl rounded-full opacity-20 transition-all duration-500 ${isLiveConnected ? 'scale-150 opacity-40' : 'scale-50'}`}></div>
                 
                 <button
                   onClick={isLiveConnected ? stopLiveSession : startLiveSession}
                   disabled={isVoiceLoading}
                   className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 border-[6px] backdrop-blur-md ${
                     isVoiceLoading ? 'bg-slate-800 border-slate-700' : 
                     isLiveConnected ? 'bg-red-500/90 hover:bg-red-600 border-red-400/50 shadow-red-500/50 scale-110' : 
                     'bg-brand-600/90 hover:bg-brand-500 border-brand-400/50 shadow-brand-500/50 hover:scale-105'
                   }`}
                 >
                   {isVoiceLoading ? <Loader2 size={40} className="animate-spin text-white" /> :
                    isLiveConnected ? <MicOff size={40} className="text-white" /> :
                    <Mic size={40} className="text-white" />}
                 </button>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                {isLiveConnected ? (isPlayingAudio ? "Speaking..." : "Listening...") : "Tap to Speak"}
              </h3>
              
              {/* Transcription Preview (Optional but good for feedback) */}
              <div className="h-12 flex items-center justify-center">
                 {isLiveConnected && (
                    <p className="text-sm text-slate-300 animate-pulse">
                        {currentInputTransRef.current ? "..." : (isPlayingAudio ? "AI Speaking..." : "")}
                    </p>
                 )}
              </div>

              <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">
                {voiceError || (isLiveConnected ? "I'm listening. Ask about Tokyo time or our pricing models." : "Experience the world's most advanced conversational AI.")}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};