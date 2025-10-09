import { TestBed } from '@angular/core/testing';
import { ChannelService } from './channel';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Channel } from '../models/channel.model';

describe('ChannelService', () => {
  let service: ChannelService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      post: jasmine.createSpy('post').and.returnValue(of({})),
      get: jasmine.createSpy('get').and.returnValue(of([])),
      delete: jasmine.createSpy('delete').and.returnValue(of({}))
    };

    (spyOn(localStorage, 'getItem') as any).and.callFake((key: string) => {
      if (key === 'channels')
        return JSON.stringify([{ id: 'c1', name: 'General', groupId: 'g1' }]);
      return null;
    });
    (spyOn(localStorage, 'setItem') as any);

    TestBed.configureTestingModule({
      providers: [
        ChannelService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(ChannelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.post on createChannel()', () => {
    service.createChannel('Test', 'g1', 'admin1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/channels/create',
      { name: 'Test', groupId: 'g1', adminId: 'admin1' }
    );
  });

  it('should call HttpClient.post on addUserToChannel()', () => {
    service.addUserToChannel('c1', 'admin1', 'user1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/channels/c1/add-user',
      { adminId: 'admin1', userId: 'user1' }
    );
  });

  it('should call HttpClient.post on removeUserFromChannel()', () => {
    service.removeUserFromChannel('c1', 'admin1', 'user1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/channels/c1/remove-user',
      { adminId: 'admin1', userId: 'user1' }
    );
  });

  it('should call HttpClient.post on leaveChannel()', () => {
    service.leaveChannel('c1', 'user1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/channels/leave',
      { channelId: 'c1', userId: 'user1' }
    );
  });

  it('should call HttpClient.get on getGroupChannels()', () => {
    service.getGroupChannels('g1', 'u1').subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(
      'http://localhost:3000/api/channels/group/g1',
      { params: { userId: 'u1' } }
    );
  });

  it('should call HttpClient.delete on deleteChannel()', () => {
    service.deleteChannel('c1', 'admin1').subscribe();
    expect(mockHttp.delete).toHaveBeenCalledWith(
      'http://localhost:3000/api/channels/c1',
      { body: { adminId: 'admin1' } }
    );
  });

  it('should save channels to localStorage', () => {
    const data: Channel[] = [{ id: 'c1', name: 'General', groupId: 'g1' }]; // ✅ 增加 groupId
    service.saveChannels(data);
    expect(localStorage.setItem).toHaveBeenCalledWith('channels', JSON.stringify(data));
  });

  it('should get channels from localStorage', () => {
    const channels = service.getChannels();
    expect(channels.length).toBe(1);
    expect(channels[0].groupId).toBe('g1');
  });
});
