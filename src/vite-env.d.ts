/// <reference types="vite/client" />
/// <reference types="vite/client" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export {};
