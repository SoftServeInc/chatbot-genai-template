import { waitFor } from '@testing-library/react';
import * as client from '../../../api/client/index';
import { sendMessage, streamMessage } from './conversation';

jest.mock('../../../api/client/index', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('chats methods', () => {
  it('sendMessage', async () => {
    const mockResponse: string = 'title';
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);

    const result = await sendMessage('12345', mockResponse);
    expect(result).toEqual(mockResponse);
    expect(client.api.post).toHaveBeenCalled();
  });

  it('sendMessage Error', async () => {
    (client.api.post as jest.Mock).mockRejectedValue({});

    const result = await sendMessage('12345', 'aaa');
    expect(result).toEqual([]);
    expect(client.api.post).toHaveBeenCalled();
  });

  it('streamMessage', async () => {
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
    const result = await streamMessage('12345', 'message');
    await waitFor(() => expect(expect(result).toEqual([])));
  });

  it('streamMessage error', async () => {
    // @ts-expect-error:next-line
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
      }),
    );
    global.TextDecoderStream = jest.fn();
    const result = await streamMessage('12345', 'message');
    expect(expect(result).toEqual([]));
  });
});
