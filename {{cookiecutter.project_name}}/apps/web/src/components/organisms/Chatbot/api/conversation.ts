import { AUTH_TOKEN_KEY, ENVIRONMENT } from '@/constants';
import { noop } from '@/services/api/common';
import { api } from 'ui/src/api/client/index';
import { Message } from '../types/Message';

export async function sendMessage(chatId: string, message: string): Promise<Message[]> {
  try {
    const { data } = await api.post(`/chats/${chatId}/converse`, {
      data: [{ type: 'text', content: message }],
    });
    const response = data.data;
    return response;
  } catch (error) {
    return [];
  }
}

export async function streamMessage(
  chatId: string,
  message_content: string,
  abortController?: AbortController,
  onProgress?: (segments: Message[]) => void,
): Promise<Message[]> {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const config = {
    baseURL: ENVIRONMENT.VITE_API_BASE_URL,
    token: token ? JSON.parse(token) : null,
  };

  const response = await fetch(`${config.baseURL}/chats/${chatId}/converse-stream`, {
    signal: abortController?.signal,
    method: 'POST',
    keepalive: false,
    cache: 'no-cache',
    headers: {
      'Accept': 'application/x-ndjson',
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': config.token ? `Bearer ${config.token}` : '',
    },
    body: JSON.stringify({ data: [{ type: 'text', content: message_content }] }),
  });

  if (!response.body) {
    return [];
  }
  // Applicable for work with Vertex AI model due to an issue in LangChain with a streaming response from Vertex AI. When an issue is fixed, the current code can be removed;
  if (response.status === 501) {
    const result = await sendMessage(chatId, message_content);
    return result;
  }

  if (response.status !== 200) {
    throw new Error(`Assistant response generation failed with status ${response.status}`);
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  const messages = <Message[]>[];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      let modified = false;

      value
        .trim()
        .split('\n\n') // split by SSE events
        .filter(Boolean)
        .map((content) => {
          // parse SSE event, which is in the following format:
          //
          // event: <event name>
          // data: <event data>
          //
          const lines = content.split('\n');
          const sse: { event?: string; data?: any } = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
          const originSSE: { event?: string; data?: any } = {}; // eslint-disable-line @typescript-eslint/no-explicit-any

          lines.forEach((line) => {
            const [k, v] = line.split(': ');
            if (k === 'event') {
              sse[k] = v;
              originSSE[k] = v;
            }
            if (k === 'data') {
              // The data field is a JSON string, so we need to parse it
              sse[k] = JSON.parse(v);
              originSSE[k] = JSON.parse(v);
            }
          });
          return sse;
        })
        .forEach(({ event, data }) => {
          if (!data || !event || !['message', 'segment'].includes(event)) {
            return;
          }

          modified = true;

          if (event === 'message') {
            modified = true;
            messages.push(data);
            return;
          }

          const { message_id: messageId, segment: newSegment } = data;
          const message = messages.find((m) => m.id === messageId);

          // Ignore segments for unknown messages
          if (!message) {
            return;
          }

          const { segments } = message;

          // Save the non-text segments as they are without any further processing
          if (newSegment.type !== 'text') {
            segments.push(newSegment);
            return;
          }

          // Ignore empty text segments, although usually there shouldn't be any
          if (newSegment.content === '') {
            return;
          }

          // Merge consecutive text segments
          const lastSegment = segments[segments.length - 1];
          if (lastSegment?.type === 'text') {
            lastSegment.content += newSegment.content;
          } else {
            segments.push(newSegment);
          }
        });

      if (modified) {
        onProgress?.(messages);
      }
    } catch (err) {
      const aborted = err instanceof Error && err.name === 'AbortError';

      if (!aborted) {
        // eslint-disable-next-line no-console
        console.error('Assistant response generation failed', err);
      }

      break;
    }
  }

  noop(); // should be here to initiate the previous request connection close

  messages.forEach((message) => {
    // The stream is closed, so all messages are complete
    // eslint-disable-next-line no-param-reassign
    message.in_progress = false;
  });

  // Call onProgress one last time to notify the caller that the messages are complete
  onProgress?.(messages);

  return messages;
}
