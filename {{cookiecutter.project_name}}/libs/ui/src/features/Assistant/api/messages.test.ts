import { Chat, MessageRating } from '../../../types';
import * as client from '../../../api/client/index';
import { addFeedback, getOne } from './messages';

jest.mock('../../../api/client/index', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
describe('messages methods', () => {
  it('getOne', async () => {
    const mockResponse: Chat = { user_id: '12345', title: 'title' } as Chat;
    const response = { data: { data: mockResponse } };
    (client.api.get as jest.Mock).mockResolvedValue(response);

    const result = await getOne('12345');
    expect(result).toEqual(mockResponse);
    expect(client.api.get).toHaveBeenCalled();
  });

  it('getOne Error', async () => {
    (client.api.get as jest.Mock).mockRejectedValue({});

    const result = await getOne('12345');
    expect(result).toEqual(null);
    expect(client.api.get).toHaveBeenCalled();
  });

  it('addFeedback', async () => {
    const mockResponse: Chat[] = [{ user_id: '12345', title: 'title' }] as Chat[];
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);
    const result = await addFeedback('12345', {} as MessageRating);
    expect(result).toEqual(mockResponse);
    expect(client.api.post).toHaveBeenCalled();
  });

  it('addFeedback Error', async () => {
    (client.api.post as jest.Mock).mockRejectedValue({});
    const result = await addFeedback('12345', {} as MessageRating);
    expect(result).toEqual(null);
    expect(client.api.post).toHaveBeenCalled();
  });
});
