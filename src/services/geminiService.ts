// @ts-nocheck
import { GoogleGenAI, Chat, GenerateContentResponse, LiveServerMessage, Modality, FunctionDeclaration, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, BOOKING_URL } from '../constants';

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (aiClient) return aiClient;
  
  let apiKey: string | undefined;
  try {
    apiKey = process.env.API_KEY;
  } catch (e) {
    console.warn("Could not access process.env.API_KEY");
  }

  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// --- Helpers ---

export const dispatchToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message, type } 
    }));
  }
};

export const downloadAsFile = (filename: string, content: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

interface EmailResult {
  success: boolean;
  message: string;
}

export const sendEmailData = async (data: any, subject: string): Promise<EmailResult> => {
  // FAST FAIL: Check Protocol (Will pass on localhost, fail on file://)
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return { 
      success: false, 
      message: "RESTRICTED: You are running this file locally without a server. Please use 'npm run dev' or a local web server to enable Email & Mic features." 
    };
  }

  const targetEmail = "troyhill@sentientpartners.ai";
  const endpoint = `https://formsubmit.co/ajax/${targetEmail}`;
  const timestamp = new Date();
  
  const uniqueSubject = `${subject} - ${timestamp.toLocaleString()}`;

  console.log(`[Email Service] Preparing to send to ${targetEmail}...`);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: uniqueSubject,
        _template: "table",
        _captcha: "false", 
        source: "Sentient AI Web Agent",
        sent_at: timestamp.toLocaleString(),
        ...data
      }),
    });

    const responseText = await response.text();
    console.log("[Email Service] Raw Response:", responseText);

    let responseData: any = {};
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.warn("[Email Service] Could not parse JSON response");
      return { success: false, message: "Invalid response from email server." };
    }

    const isSuccess = responseData.success === "true" || responseData.success === true;
    const message = responseData.message || "";

    if (response.ok && isSuccess) {
      if (message.toLowerCase().includes('activate') || message.toLowerCase().includes('check your email')) {
         return { success: true, message: "Email Sent! Please check your inbox to ACTIVATE this endpoint (First time only)." };
      }
      return { success: true, message: "Email transmitted successfully." };
    } else {
      const errorMsg = message || "Email server rejected the request.";
      return { success: false, message: errorMsg };
    }
  } catch (error: any) {
    console.error("[Email Service] Network Error:", error);
    return { success: false, message: "Network connection failed." };
  }
};

export const sendTestEmail = async (): Promise<EmailResult> => {
  const timestamp = new Date().toLocaleString();
  return await sendEmailData({
    Status: "Connection Verified",
    Timestamp: timestamp,
    Test_ID: Date.now(),
    Note: "If you received this email, your transcript system is fully functional.",
    System: "Sentient Partners AI Web Agent"
  }, "Connection Test Verification");
};

// --- Tools ---

const tools: { functionDeclarations: FunctionDeclaration[] }[] = [{
  functionDeclarations: [
    {
      name: "scheduleMeeting",
      description: "Opens the real-time booking calendar modal on the user's screen. Use this when the user wants to book a call. You can also use this to re-open the calendar if the user asks (no parameters needed for re-opening).",
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "User's full name (optional)" },
          email: { type: Type.STRING, description: "User's email address (optional)" },
          date: { type: Type.STRING, description: "Preferred date in YYYY-MM-DD format (optional)" }
        },
        required: []
      }
    },
    {
      name: "captureLead",
      description: "Captures user contact information and inquiry details to send to the Sentient Partners team via email. Use this as a fallback if booking fails.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "User's full name" },
          email: { type: Type.STRING, description: "User's email address" },
          phone: { type: Type.STRING, description: "User's phone number (optional)" },
          inquiry: { type: Type.STRING, description: "Summary of user's needs or questions" }
        },
        required: ["name", "email"]
      }
    }
  ]
}];

// --- Tool Implementations ---

const scheduleMeeting = (name?: string, email?: string, date?: string) => {
  const params = new URLSearchParams();
  
  if (name && name !== 'null' && name !== 'undefined') params.append('name', name);
  if (email && email !== 'null' && email !== 'undefined') params.append('email', email);
  if (date && date !== 'null' && date !== 'undefined') params.append('date', date);

  const fullUrl = `${BOOKING_URL}?${params.toString()}`;

  console.log("[GeminiService] Opening Calendar with URL:", fullUrl);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-booking-modal', { 
      detail: { url: fullUrl } 
    }));
    document.dispatchEvent(new CustomEvent('open-booking-modal', { 
      detail: { url: fullUrl } 
    }));
    dispatchToast("Opening Calendar...", "success");
  }

  return { 
    success: true, 
    message: "Calendar interface opened successfully." 
  };
};

const captureLead = async (name: string, email: string, phone?: string, inquiry?: string) => {
  dispatchToast("Sending information...", "info");
  
  const result = await sendEmailData({
    Lead_Name: name, 
    Lead_Email: email, 
    Lead_Phone: phone || "Not provided", 
    Lead_Inquiry: inquiry || "General Inquiry"
  }, "New Lead Capture");

  if (result.success) {
    dispatchToast("Information sent to team.", "success");
    return { success: true, message: "Lead information securely transmitted to the team." };
  } else {
    console.warn("Lead email failed, saving locally.");
    const leadData = `LEAD CAPTURE\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nInquiry: ${inquiry}\nDate: ${new Date().toLocaleString()}`;
    downloadAsFile(`lead-${name.replace(/\s+/g, '-')}.txt`, leadData);
    dispatchToast("Saved to your device.", "info");
    return { success: false, message: "Network issue. Information saved to user's device." };
  }
};

const executeTool = async (name: string, args: any) => {
  console.log(`[GeminiService] Executing tool: ${name}`, args);
  const safeArgs = args || {}; 
  
  try {
    if (name === "scheduleMeeting") {
      return scheduleMeeting(safeArgs.name, safeArgs.email, safeArgs.date);
    }
    if (name === "captureLead") {
      return await captureLead(safeArgs.name, safeArgs.email, safeArgs.phone, safeArgs.inquiry);
    }
    return { error: "Function not found" };
  } catch (error: any) {
    console.error(`[GeminiService] Error executing ${name}:`, error);
    return { error: `Tool execution failed: ${error.message || "Unknown error"}` };
  }
};

// --- Features ---

export const sendTranscript = async (chatLog: string, voiceLog: string) => {
  if (!chatLog && !voiceLog) return { success: false, message: "No content" };

  const result = await sendEmailData({ 
    chat_history: chatLog || "No text chat recorded.",
    voice_transcript: voiceLog || "No voice interaction recorded."
  }, "New Client Transcript");

  if (result.success) {
    dispatchToast("Transcript sent successfully.", "success");
    return { success: true, message: "Sent" };
  } else {
    console.warn("Transcript email failed, initiating fallback download.");
    const fullLog = `SENTIENT PARTNERS TRANSCRIPT\nDate: ${new Date().toLocaleString()}\n\n--- CHAT LOG ---\n${chatLog}\n\n--- VOICE LOG ---\n${voiceLog}`;
    downloadAsFile(`transcript-${Date.now()}.txt`, fullLog);
    dispatchToast("Transcript saved to your device.", "info");
    return { success: true, message: "Saved locally" };
  }
};

// --- Context Helper ---

export const getSystemInstructionWithContext = () => {
  let timeZone = "UTC";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    console.warn("Could not determine timezone", e);
  }
  
  const now = new Date();
  const localTime = now.toLocaleTimeString('en-US', { timeZone });
  const localDate = now.toLocaleDateString('en-US', { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  return `${SYSTEM_INSTRUCTION}

[REAL-TIME USER CONTEXT]
- User Timezone: ${timeZone}
- Current Date: ${localDate}
- Current Time: ${localTime}

[EVENT HANDLING INSTRUCTIONS]
- START UP: You must ALWAYS introduce yourself immediately when the session starts. Do not wait for the user to speak. Say "Hello, I'm the Sentient AI Assistant. How can I help you today?"
- BOOKING: If the user indicates they want to book a time, call \`scheduleMeeting\` immediately.
- RE-OPENING CALENDAR: If the user says they closed the calendar or wants to see it, call \`scheduleMeeting\` again.
`;
};

// --- Text Chat Service ---

export const initializeChat = (): Chat | null => {
  const ai = getClient();
  if (ai) {
    try {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: getSystemInstructionWithContext(),
          tools: [...tools, { googleSearch: {} }],
        },
      });
    } catch (error) {
      console.error("Failed to initialize Gemini client:", error);
    }
  } else {
    console.warn("API Key is missing. Running in fallback mode.");
  }

  return chatSession;
};

export const sendMessageToGemini = async function* (message: string): AsyncGenerator<string, void, unknown> {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    await new Promise(resolve => setTimeout(resolve, 600));
    yield "I'm operating in Demo Mode. Please configure your API Key to enable the full Sentient experience.";
    return;
  }

  try {
    let result = await chatSession.sendMessageStream({ message });
    
    while (true) {
      let toolCalls: any[] = [];
      
      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        
        if (responseChunk.text) {
          yield responseChunk.text;
        }
        
        const candidates = responseChunk.candidates;
        if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.functionCall) {
              toolCalls.push(part.functionCall);
            }
          }
        }
      }

      if (toolCalls.length === 0) {
        break; 
      }

      const functionResponses = [];
      for (const call of toolCalls) {
        const toolResult = await executeTool(call.name, call.args);
        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: { result: toolResult }
          }
        });
      }

      result = await chatSession.sendMessageStream({ message: functionResponses });
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "I apologize, but I'm encountering a temporary connection issue. Please try again.";
  }
};

// --- Live API / Audio Helpers ---

export const connectLiveSession = async (callbacks: {
  onopen?: () => void;
  onmessage: (message: LiveServerMessage) => void;
  onclose?: (e: CloseEvent) => void;
  onerror?: (e: ErrorEvent) => void;
}) => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  const voiceSystemInstruction = getSystemInstructionWithContext() + `
  
  [VOICE MODE ACTIVE]
  CRITICAL PROTOCOL:
  1. The user has just connected to voice.
  2. You MUST speak first. Do not wait for the user.
  3. Introduce yourself concisely.
  4. If the user asks to book, call scheduleMeeting instantly.
  `;

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: callbacks.onopen || (() => {}),
      onmessage: async (message: LiveServerMessage) => {
        callbacks.onmessage(message);

        if (message.toolCall) {
          console.log("[GeminiService] Received Tool Call from Live API", message.toolCall);
          const functionResponses = [];
          for (const fc of message.toolCall.functionCalls) {
             const result = await executeTool(fc.name, fc.args || {});
             functionResponses.push({
               id: fc.id,
               name: fc.name,
               response: { result: result }
             });
          }
          
          if (functionResponses.length > 0) {
            sessionPromise.then(session => {
              session.sendToolResponse({
                functionResponses: functionResponses
              });
            });
          }
        }
      },
      onclose: callbacks.onclose || (() => {}),
      onerror: callbacks.onerror || (() => {}),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: voiceSystemInstruction,
      tools: [...tools, { googleSearch: {} }], 
    },
  });
  
  return sessionPromise;
};

export function createPcmBlob(data: Float32Array, sampleRate: number = 16000): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    let s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: `audio/pcm;rate=${sampleRate}`,
  };
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
