export interface ChatMessage {
  id: string;
  user_id: string;
  token_slug: string;
  question: string;
  answer: string;
  metadata?: {
    processing_time: number;
    model_used: string;
    timestamp: string;
    context_messages: number;
    has_token_data?: boolean;
    has_project_data?: boolean;
    message_id?: string;
    api_calls?: {
      pretge_token_api: boolean;
      pretge_project_api: boolean;
    };
  };
  citations?: Array<{
    source: string;
    title: string;
    relevance_score: number;
  }>;
  message_order: number;
  created_at: string;
  updated_at: string;
}

export interface ChatRequest {
  user_id: string;
  token_slug: string;
  question: string;
}

export interface ChatResponse {
  statusCode: number;
  message: string;
  data: {
    answer: string;
    citations?: Array<{
      source: string;
      title: string;
      relevance_score: number;
    }>;
    metadata?: {
      token_slug: string;
      processing_time: number;
      model_used: string;
      message_id: string;
      context_messages: number;
      has_token_data?: boolean;
      has_project_data?: boolean;
      api_calls?: {
        pretge_token_api: boolean;
        pretge_project_api: boolean;
      };
    };
  };
  timestamp: string;
}

export interface ChatHistoryResponse {
  statusCode: number;
  message: string;
  data: ChatMessage[];
  timestamp: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  currentToken: string;
  currentUserId: string;
  isOpen: boolean;
}

export interface ChatActions {
  sendMessage: (question: string) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => void;
  setToken: (token: string) => void;
  setUserId: (userId: string) => void;
  toggleWidget: () => void;
  setOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setTyping: (isTyping: boolean) => void;
  setError: (error: string | null) => void;
}
