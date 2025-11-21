/**
 * Core utilities for the Cloudflare Durable Object and KV template
 */

export interface Env {
    ASSETS: Fetcher;

    // KV Namespaces
    PATIENT_DATA?: KVNamespace;           // Patient records, PHI data
    SESSIONS?: KVNamespace;                // User sessions, auth tokens
    CACHE?: KVNamespace;                   // API response caching

    // Durable Objects
    TERMINAL_SESSION?: DurableObjectNamespace;  // Terminal/CLI state management
    AGENT_EXECUTOR?: DurableObjectNamespace;    // AI agent execution state
    PATIENT_COORDINATOR?: DurableObjectNamespace; // Patient data coordination

    // R2 Buckets
    MEDICAL_FILES?: R2Bucket;              // Audio files, PDFs, transcriptions
    PATIENT_DOCUMENTS?: R2Bucket;          // Patient dossiers, reports

    // Queues
    FILE_PROCESSING_QUEUE?: Queue;         // Background file processing
    TRANSCRIPTION_QUEUE?: Queue;           // Audio transcription jobs
    ANALYSIS_QUEUE?: Queue;                // ASL analysis jobs

    // Secrets
    CLAUDE_API_KEY?: string;               // Anthropic API key
    ELEVENLABS_API_KEY?: string;           // ElevenLabs API key
    DB_CONNECTION_STRING?: string;        // Optional external DB
    JWT_SECRET?: string;                   // Session signing
    ENVIRONMENT?: string;                  // Environment (development, production)

    // Analytics Bindings (optional)
    ANALYTICS?: AnalyticsEngineDataset;
}