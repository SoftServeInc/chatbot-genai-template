import { Chat } from '../../../types';
import * as client from '../../../api/client/index';
import { create, generateTitle, getAll, getOne, remove, updateTitle } from './chats';

jest.mock('../../../api/client/index', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));
describe('chats methods', () => {
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

  it('getAll', async () => {
    const mockResponse: Chat[] = [{ user_id: '12345', title: 'title' }] as Chat[];
    const response = { data: mockResponse };
    (client.api.get as jest.Mock).mockResolvedValue(response);
    const result = await getAll();
    expect(result).toEqual(mockResponse);
    expect(client.api.get).toHaveBeenCalled();
  });

  it('getAll Error', async () => {
    (client.api.get as jest.Mock).mockRejectedValue({});
    const result = await getAll();
    expect(result).toEqual(null);
    expect(client.api.get).toHaveBeenCalled();
  });

  it('generateTitle', async () => {
    const mockResponse: Chat = { user_id: '12345', title: 'title' } as Chat;
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);

    const result = await generateTitle('12345');
    expect(result).toEqual(mockResponse.title);
    expect(client.api.post).toHaveBeenCalled();
  });
  it('generateTitle Error', async () => {
    (client.api.post as jest.Mock).mockRejectedValue({});

    const result = await generateTitle('12345');
    expect(result).toEqual(null);
    expect(client.api.post).toHaveBeenCalled();
  });

  it('create', async () => {
    const mockResponse: Chat = { user_id: '12345', title: 'title' } as Chat;
    const response = { data: { data: mockResponse } };
    (client.api.post as jest.Mock).mockResolvedValue(response);

    const result = await create('12345');
    expect(result).toEqual(mockResponse);
    expect(client.api.post).toHaveBeenCalled();
  });
  it('create ERROR', async () => {
    (client.api.post as jest.Mock).mockRejectedValue({});

    const result = await create('12345');
    expect(result).toEqual(null);
    expect(client.api.post).toHaveBeenCalled();
  });

  it('updateTitle', async () => {
    const mockResponse: Chat = { user_id: '12345', title: 'title' } as Chat;
    const response = { data: { data: mockResponse } };
    (client.api.patch as jest.Mock).mockResolvedValue(response);

    const result = await updateTitle('12345', 'new Title');
    expect(result).toEqual(mockResponse);
    expect(client.api.patch).toHaveBeenCalled();
  });

  it('updateTitle Error', async () => {
    (client.api.patch as jest.Mock).mockRejectedValue({});
    const result = await updateTitle('12345', 'new Title');
    expect(result).toEqual(null);
    expect(client.api.patch).toHaveBeenCalled();
  });

  it('remove', async () => {
    const mockResponse = 'deleted';
    const response = { statusText: mockResponse };
    (client.api.delete as jest.Mock).mockResolvedValue(response);

    const result = await remove('12345');
    expect(result).toEqual(mockResponse);
    expect(client.api.delete).toHaveBeenCalled();
  });
  it('remove Error', async () => {
    (client.api.delete as jest.Mock).mockRejectedValue({});
    const result = await remove('12345');
    expect(result).toEqual(null);
    expect(client.api.delete).toHaveBeenCalled();
  });
});
