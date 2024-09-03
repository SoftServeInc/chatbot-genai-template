import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { useChatbotStore, defaultState } from '../store';
import { Chat, Message, MessageAuthor, MessageRating } from '../../../../types';
import * as client from '../../../../api/client/index';

jest.mock('../../../../api/client/index', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useChatbotStore', () => {
  beforeEach(() => {
    useChatbotStore.setState(defaultState);
  });
  it('default values test', () => {
    const { result } = renderHook(() => useChatbotStore());
    expect(result.current.chats).toEqual([]);
    expect(result.current.title).toEqual('New Chat');
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toEqual(false);
  });

  it('createNewChat success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    expect(result.current.chats).toEqual([]);
    const mockResponse: Chat = { user_id: '12345', title: 'title' } as Chat;
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.createNewChat();
    });
    await waitFor(() => expect(result.current.chats.length).toEqual(1));
    await waitFor(() => expect(result.current.chats[0].title).toEqual(mockResponse.title));
  });
  it('createNewChat error action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    (client.api.post as jest.Mock).mockRejectedValue({});
    act(() => {
      result.current.createNewChat();
    });
    await waitFor(() => expect(result.current.isCreating).toEqual(false));
  });

  it('fetchChat success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    expect(result.current.messages).toEqual([]);
    const mockResponse: Chat = { title: '12345', messages: ['title'] } as unknown as Chat;
    const response = { data: { data: mockResponse } };
    (client.api.get as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.fetchChat('12345');
    });
    await waitFor(() => expect(result.current.messages.length).toEqual(1));
    await waitFor(() => expect(result.current.messages).toEqual(mockResponse.messages));
  });
  it('fetchChat error action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    (client.api.get as jest.Mock).mockRejectedValue({});
    act(() => {
      result.current.fetchChat('12345');
    });
    await waitFor(() => expect(result.current.isLoading).toEqual(true));
  });

  it('fetchChats success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    expect(result.current.messages).toEqual([]);
    const mockResponse: Chat = {
      title: '12345',
      messages: [{ segments: [{ content: 'segment' }] }],
    } as unknown as Chat;
    const response = { data: { data: [mockResponse] } };
    (client.api.get as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.fetchChats();
    });
    await waitFor(() => expect(result.current.chats.length).toEqual(1));
    await waitFor(() => expect(result.current.chats[0].details).toEqual('segment'));
  });
  it('fetchChats error action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    (client.api.get as jest.Mock).mockRejectedValue({});
    act(() => {
      result.current.fetchChats();
    });
    await waitFor(() => expect(result.current.isLoading).toEqual(true));
  });

  it('generateChatTitle success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    useChatbotStore.setState({
      ...defaultState,
      id: '12345',
      messages: [
        { role: MessageAuthor.assistant } as Message,
        { role: MessageAuthor.assistant } as Message,
      ],
    });
    const mockResponse = {
      title: '12345',
    };
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.generateChatTitle();
    });
    await waitFor(() => expect(result.current.title).toEqual(mockResponse.title));
  });
  it('generateChatTitle action no messages ', async () => {
    const { result } = renderHook(() => useChatbotStore());
    (client.api.get as jest.Mock).mockRejectedValue({});
    act(() => {
      result.current.generateChatTitle();
    });
    await waitFor(() => expect(result.current.isUpdating).toEqual(false));
  });

  it('rateMessage success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    useChatbotStore.setState({
      ...defaultState,
      messages: [
        { role: MessageAuthor.assistant, id: 'messageId' } as Message,
        { role: MessageAuthor.assistant } as Message,
      ],
    });
    const mockResponse = {
      rating: '12345',
    };
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.rateMessage('feedback' as unknown as MessageRating, 'messageId');
    });
    await waitFor(() =>
      expect(result.current.messages[0].feedback_rating).toEqual(mockResponse.rating),
    );
  });
  it('rateMessage action no messages ', async () => {
    const { result } = renderHook(() => useChatbotStore());
    (client.api.get as jest.Mock).mockRejectedValue({});
    act(() => {
      result.current.rateMessage('feedback' as unknown as MessageRating, 'messageId');
    });
    await waitFor(() => expect(result.current.isUpdating).toEqual(true));
  });

  it('removeChat success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    useChatbotStore.setState({
      ...defaultState,
      id: 'chatId',
      chats: [{ title: 'title1', id: 'chatId' } as Chat, { title: 'title2' } as Chat],
    });
    const mockResponse = {};
    const response = { data: { data: mockResponse } };
    (client.api.delete as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.removeChat('chatId');
    });
    await waitFor(() => expect(result.current.chats.length).toEqual(1));
  });

  it('updateChatTitle success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    useChatbotStore.setState({
      ...defaultState,
      chats: [{ title: 'title1', id: 'chatId' } as Chat, { title: 'title2' } as Chat],
    });
    const mockResponse = {
      title: '12345',
      id: 'chatId',
    };
    const response = { data: { data: mockResponse } };
    (client.api.patch as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.updateChatTitle(mockResponse.title, 'chatId');
    });
    await waitFor(() => expect(result.current.chats[0].title).toEqual(mockResponse.title));
  });

  it('sendMessage success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    useChatbotStore.setState({
      ...defaultState,
      id: '12345',
      chats: [{ title: 'title1', id: 'chatId' } as Chat, { title: 'title2' } as Chat],
    });
    const mockResponse = {
      segments: ['12345'],
    };
    const response = { data: { data: [mockResponse] } };
    (client.api.post as jest.Mock).mockResolvedValue(response);
    act(() => {
      result.current.sendMessage('message');
    });
    await waitFor(() => expect(result.current.messages[0].segments[0].content).toEqual('message'));
  });

  it('streamMessage success action', async () => {
    const { result } = renderHook(() => useChatbotStore());
    useChatbotStore.setState({
      ...defaultState,
      id: '12345',
      chats: [{ title: 'title1', id: 'chatId' } as Chat, { title: 'title2' } as Chat],
    });
    // eslint-disable-next-line func-names
    const generatorFunction = function* () {
      yield {
        value: `res\npo\nnse\n\n1`,
        done: false,
      };
      yield { value: 'res\npon\nse\n\n2', done: false };
      yield { value: 'response\n\n3', done: false };
      yield { value: 'response\n\n4', done: true };
    };
    const gen = generatorFunction();
    const generator = () => {
      return new Promise((resolve) => {
        resolve(gen.next().value);
      });
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        body: {
          // @ts-expect-error:next-line
          pipeThrough: jest.fn(() => ({
            getReader: () => ({
              read: generator,
            }),
          })),
        },
        status: 200,
      }),
    );
    global.TextDecoderStream = jest.fn();
    act(() => {
      result.current.streamMessage('message', {} as AbortController);
    });
    await waitFor(() => expect(result.current.messages[0].segments[0].content).toEqual('message'));
  });
});
