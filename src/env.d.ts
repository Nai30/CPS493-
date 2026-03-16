/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_BASE_URL: string
  // Add more environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
