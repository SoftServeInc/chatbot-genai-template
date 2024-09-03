export type PayloadType = 'request' | 'response' | 'event';

export interface Payload {
  id?: string;
  type: PayloadType;
  body: unknown;
}

export interface Log {
  id: string;
  baseURL: string;
  method: string;
  url: string;
  status?: number;
  payload: Payload[];
  time: {
    startTime: Date | null;
    endTime: Date | null;
  };
}

export interface LogRequest {
  id: string;
  url: string;
  method: string;
  baseURL: string;
  data: unknown;
  time: {
    startTime: Date | null;
    endTime: Date | null;
  };
}

export interface LogResponse {
  id: string;
  type: string;
  status: string;
  data: unknown;
  time: {
    startTime: Date | null;
    endTime: Date | null;
  };
}
