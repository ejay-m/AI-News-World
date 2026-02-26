import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Volume2, VolumeX, Loader2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

export const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [userTranscription, setUserTranscription] = useState('');
  const [aiTranscription, setAiTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sessionRef = useRef<any>(null);
  const audioQueueRef = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userTranscription, aiTranscription]);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startSession = async () => {
    try {
      setError(null);
      setIsConnected(false);
      setUserTranscription('');
      setAiTranscription('');
      
      const callbacks = {
        onopen: () => {
          setIsConnected(true);
          startRecording();
        },
        onmessage: async (message: LiveServerMessage) => {
          console.log('Live Message:', message);

          if (message.serverContent?.modelTurn) {
            setIsThinking(false);
          }

          // Handle Tool Calls (if any)
          if (message.toolCall) {
            console.log('Tool Call received:', message.toolCall);
            // We don't have custom tools yet, but we should acknowledge
          }

          // Handle Audio and Text
          if (message.serverContent?.modelTurn?.parts) {
            const audioPart = message.serverContent.modelTurn.parts.find(p => p.inlineData);
            const textPart = message.serverContent.modelTurn.parts.find(p => p.text);

            if (audioPart?.inlineData?.data) {
              setIsSpeaking(true);
              const base64Data = audioPart.inlineData.data;
              const binaryString = atob(base64Data);
              const len = binaryString.length;
              const bytes = new Int16Array(len / 2);
              for (let i = 0; i < len; i += 2) {
                bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
              }
              audioQueueRef.current.push(bytes);
              if (!isPlayingRef.current) {
                playNextInQueue();
              }
            }

            if (textPart?.text) {
              setAiTranscription(prev => prev + ' ' + textPart.text);
            }
          }

          // Handle User Transcription
          const inputTranscript = message.serverContent?.inputTranscription?.text;
          if (inputTranscript) {
            setUserTranscription(inputTranscript);
          }

          if (message.serverContent?.interrupted) {
            stopPlayback();
          }
          
          if (message.serverContent?.turnComplete) {
            // Turn complete is a good signal, but we also rely on audio queue finishing
            console.log('Turn complete');
            setIsThinking(false);
          }
        },
        onerror: (err: any) => {
          console.error('Live API Error:', err);
          setError('Connection error. Please try again.');
          stopSession();
        },
        onclose: () => {
          setIsConnected(false);
          stopSession();
        }
      };

      sessionRef.current = await geminiService.getLiveConnection(callbacks);
    } catch (err) {
      console.error('Failed to start session:', err);
      setError('Microphone access denied or connection failed.');
    }
  };

  const startRecording = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (!sessionRef.current || isSpeaking || isMuted) {
          setVolume(0);
          return;
        }
        
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume for UI
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const currentVolume = Math.sqrt(sum / inputData.length);
        setVolume(currentVolume);

        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = arrayBufferToBase64(pcmData.buffer);
        
        // If we detect a significant drop in volume after talking, it might help to signal turn end
        // but the Live API handles this via VAD. We just send the audio.
        
        try {
          sessionRef.current.sendRealtimeInput({
            media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
          });
          if (currentVolume > 0.01 && !isSpeaking) {
            setIsThinking(true);
          }
        } catch (err) {
          console.error('Failed to send audio:', err);
        }
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      setIsListening(true);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Microphone access denied.');
    }
  };

  const playNextInQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);
    const pcmData = audioQueueRef.current.shift()!;
    
    if (!audioContextRef.current) return;

    const audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 0x7FFF;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      if (audioQueueRef.current.length === 0) {
        setIsSpeaking(false);
        isPlayingRef.current = false;
      } else {
        playNextInQueue();
      }
    };
    source.start();
  };

  const stopPlayback = () => {
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsSpeaking(false);
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsListening(false);
    setIsConnected(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setIsMuted(false);
    setVolume(0);
    stopPlayback();
  };

  const toggleAssistant = () => {
    if (isActive) {
      stopSession();
      setIsActive(false);
    } else {
      setIsActive(true);
      startSession();
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      stopPlayback();
      // Send an interrupt signal to the server if possible
      sessionRef.current?.sendRealtimeInput({
        control: { interrupt: true }
      });
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleAssistant}
        className={`fixed bottom-8 left-8 z-[60] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
          isActive ? 'bg-red-500' : 'bg-brand-orange'
        } text-white`}
      >
        {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        {isActive && isConnected && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-white rounded-full"
          />
        )}
      </motion.button>

      {/* Voice Interface Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-28 left-8 z-[60] w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {isConnected ? 'Live Assistant' : 'Connecting...'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {(userTranscription || aiTranscription) && (
                    <button 
                      onClick={() => { setUserTranscription(''); setAiTranscription(''); }}
                      className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button onClick={toggleAssistant} className="text-gray-400 hover:text-brand-orange transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-4 space-y-6">
                <div className="relative">
                  <motion.div 
                    animate={{ 
                      scale: isListening ? 1 + volume * 2 : 1,
                      boxShadow: isListening ? `0 0 ${volume * 50}px rgba(242, 125, 38, 0.4)` : 'none'
                    }}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSpeaking ? 'bg-brand-orange/10' : 'bg-gray-50'
                    }`}
                  >
                    {isSpeaking ? (
                      <Volume2 className="w-8 h-8 text-brand-orange animate-bounce" />
                    ) : isThinking ? (
                      <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                    ) : isListening ? (
                      <Mic className={`w-8 h-8 ${volume > 0.05 ? 'text-brand-orange' : 'text-gray-400'}`} />
                    ) : (
                      <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                    )}
                  </motion.div>
                  {isSpeaking && (
                    <div className="absolute -inset-4 border-2 border-brand-orange/20 rounded-full animate-ping" />
                  )}
                </div>

                <div ref={scrollRef} className="w-full space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
                  {userTranscription && (
                    <div className="bg-gray-50 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">You</p>
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{userTranscription}"</p>
                    </div>
                  )}
                  
                  {aiTranscription && (
                    <div className="bg-brand-orange/5 p-3 rounded-2xl">
                      <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mb-1">Assistant</p>
                      <p className="text-sm text-brand-dark leading-relaxed">{aiTranscription}</p>
                    </div>
                  )}

                  {!userTranscription && !aiTranscription && (
                    <div className="text-center py-4">
                      <h3 className="text-lg font-bold text-brand-dark">
                        {isSpeaking ? 'Assistant Speaking' : isThinking ? 'Assistant Thinking...' : isListening ? 'Listening to you...' : 'Starting session...'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium px-4">
                        Ask me about the latest news, summaries, or anything else.
                      </p>
                    </div>
                  )}
                </div>

                {isConnected && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleMute}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      isMuted 
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {isMuted ? (
                      <div className="flex items-center justify-center gap-2">
                        <Mic className="w-3 h-3" />
                        <span>Start Listening</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <MicOff className="w-3 h-3" />
                        <span>Stop Listening</span>
                      </div>
                    )}
                  </motion.button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-[10px] font-bold rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-center gap-2">
                <Globe className="w-3 h-3 text-brand-orange" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Grounded in Google Search</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
