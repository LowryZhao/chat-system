import { TestBed, ComponentFixture } from '@angular/core/testing';
import { VideoChatComponent, setPeerFactory } from './video-chat';

describe('VideoChatComponent', () => {
  let fixture: ComponentFixture<VideoChatComponent>;
  let component: VideoChatComponent;

  let mockPeer: any;
  let mockCall: any;
  let mockStream: MediaStream;

  class FakePeer {
    static lastOptions: any;
    constructor(options: any) {
      FakePeer.lastOptions = options;
      return mockPeer;
    }
  }

  beforeEach(async () => {
    setPeerFactory(FakePeer as any);

    mockCall = {
      on: jasmine.createSpy('on'),
      close: jasmine.createSpy('close')
    };

    mockPeer = {
      on: jasmine.createSpy('on'),
      call: jasmine.createSpy('call').and.returnValue(mockCall),
      destroy: jasmine.createSpy('destroy')
    };

    mockStream = {
      getTracks: jasmine.createSpy('getTracks').and.returnValue([{ stop: jasmine.createSpy('stop') }])
    } as any;

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: jasmine.createSpy('getUserMedia').and.returnValue(Promise.resolve(mockStream))
      }
    });

    await TestBed.configureTestingModule({
      imports: [VideoChatComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoChatComponent);
    component = fixture.componentInstance;
    (component as any).myVideo = { nativeElement: {} };
    (component as any).remoteVideo = { nativeElement: {} };
    fixture.detectChanges();
  });

  const flushAsync = async (times = 3) => {
    for (let i = 0; i < times; i++) await new Promise((r) => setTimeout(r, 0));
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize PeerJS on ngOnInit', async () => {
    await component.ngOnInit();
    await flushAsync();
    expect(mockPeer.on).toHaveBeenCalledWith('open', jasmine.any(Function));
    expect(mockPeer.on).toHaveBeenCalledWith('error', jasmine.any(Function));
    expect(mockPeer.on).toHaveBeenCalledWith('call', jasmine.any(Function));
  });

  it('should handle PeerJS error gracefully', async () => {
    class BrokenPeer {
      constructor() {
        throw new Error('Init error');
      }
    }
    setPeerFactory(BrokenPeer as any);

    const fx = TestBed.createComponent(VideoChatComponent);
    const cmp = fx.componentInstance;
    (cmp as any).myVideo = { nativeElement: {} };
    (cmp as any).remoteVideo = { nativeElement: {} };

    await cmp.ngOnInit();
    await flushAsync();

    expect(cmp.statusClass).toBe('error');
    expect(cmp.statusMessage).toContain('Unable to connect');
  });

  it('should not call peer.call if remotePeerId is empty', async () => {
    spyOn(window, 'alert');
    component.remotePeerId = ' ';
    await component.call();
    await flushAsync();
    expect(window.alert).toHaveBeenCalledWith('Please enter a valid Peer ID first.');
    expect(mockPeer.call).not.toHaveBeenCalled();
  });

  it('should call peer.call() when remotePeerId is valid', async () => {
    component.peer = mockPeer as any;
    component.remotePeerId = 'peer-123';
    await component.call();
    await flushAsync(5);
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    expect(mockPeer.call).toHaveBeenCalledWith('peer-123', mockStream);
  });

  it('should handle media access error', async () => {
    (navigator.mediaDevices.getUserMedia as jasmine.Spy).and.returnValue(
      Promise.reject(new Error('Permission denied'))
    );

    await component.call();
    await flushAsync(5);

    expect(component.statusClass).toBe('error');
    expect(component.statusMessage).toContain('Unable to access camera');
  });

  it('should clean up peer and stream on ngOnDestroy', () => {
    component.peer = mockPeer as any;
    component.localStream = mockStream;
    component.callRef = mockCall;

    component.ngOnDestroy();

    expect(mockCall.close).toHaveBeenCalled();
    expect(mockPeer.destroy).toHaveBeenCalled();
    expect(mockStream.getTracks).toHaveBeenCalled();
  });

  it('should handle cleanup error safely', () => {
    component.peer = mockPeer as any;
    component.localStream = {
      getTracks: () => {
        throw new Error('Bad track');
      }
    } as any;

    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
