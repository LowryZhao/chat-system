import { TestBed } from '@angular/core/testing';
import { ChatService, setIoFactory } from './chat.service';
import { Socket } from 'socket.io-client';
import { take } from 'rxjs/operators';

class MockSocket {
  public events: Record<string, any[]> = {};
  emit = jasmine.createSpy('emit');
  on(event: string, callback: any) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
  }
  off = jasmine.createSpy('off');
  disconnect = jasmine.createSpy('disconnect');
}

describe('ChatService', () => {
  let service: ChatService;
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();
    setIoFactory(jasmine.createSpy('io').and.returnValue(mockSocket as unknown as Socket));

    TestBed.configureTestingModule({
      providers: [ChatService]
    });

    service = TestBed.inject(ChatService);
  });

  it('should create service and connect socket', () => {
    expect(service).toBeTruthy();
  });

  it('should emit joinChannel event', () => {
    service.joinChannel('c1', 'u1', 'User');
    expect(mockSocket.emit).toHaveBeenCalledWith('joinChannel', {
      channelId: 'c1',
      userId: 'u1',
      username: 'User'
    });
  });

  it('should emit chatMessage event', () => {
    service.sendMessage('c1', 'u1', 'User', 'hi', '/img.png');
    expect(mockSocket.emit).toHaveBeenCalledWith('chatMessage', {
      channelId: 'c1',
      userId: 'u1',
      username: 'User',
      message: 'hi',
      imageUrl: '/img.png'
    });
  });

  it('should handle chatHistory event', (done) => {
    const mockData = [{ msg: 'hello' }];
    service.onHistory().pipe(take(1)).subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
    mockSocket.events['chatHistory'][0](mockData);
  });

  it('should disconnect on destroy', () => {
    service.ngOnDestroy();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
});
