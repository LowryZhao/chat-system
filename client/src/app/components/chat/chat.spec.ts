import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  const mockChatService = {
    joinChannel: jasmine.createSpy('joinChannel'),
    leaveChannel: jasmine.createSpy('leaveChannel'),
    onHistory: jasmine.createSpy('onHistory').and.returnValue(of([])),
    onMessage: jasmine.createSpy('onMessage').and.returnValue(of([])),
    onUserJoined: jasmine.createSpy('onUserJoined').and.returnValue(of([])),
    onUserLeft: jasmine.createSpy('onUserLeft').and.returnValue(of([])),
    onSystem: jasmine.createSpy('onSystem').and.returnValue(of([])),
    sendMessage: jasmine.createSpy('sendMessage')
  };

  const mockAuthService = {
    getUser: jasmine.createSpy('getUser').and.returnValue({ id: 'u1', username: 'User1' })
  };

  const mockHttpClient = {
    post: jasmine.createSpy('post').and.returnValue(of({ path: '/test/path' }))
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    component.channelId = 'c1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call joinChannel on ngOnInit', () => {
    component.ngOnInit();
    expect(mockChatService.joinChannel).toHaveBeenCalledWith('c1', 'u1', 'User1');
  });

  it('should call leaveChannel on ngOnDestroy', () => {
    component.me = { id: 'u1', username: 'User1' };
    component.channelId = 'c1';
    component.ngOnDestroy();
    expect(mockChatService.leaveChannel).toHaveBeenCalledWith('c1', 'User1');
  });

  it('should call sendMessage when send() is called with text', () => {
    component.me = { id: 'u1', username: 'User1' };
    component.channelId = 'c1';
    component.text = 'hello world';
    component.send();
    expect(mockChatService.sendMessage).toHaveBeenCalledWith('c1', 'u1', 'User1', 'hello world');
  });

  it('should upload image when imageFile is set', () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    component.me = { id: 'u1', username: 'User1' };
    component.channelId = 'c1';
    component.imageFile = mockFile;
    component.send();
    expect(mockHttpClient.post).toHaveBeenCalled();
  });

  it('should set imageFile when pickImage() is called', () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    component.pickImage(event);
    expect(component.imageFile).toBe(file);
  });

  it('should navigate to /video on goToVideoChat()', () => {
    component.goToVideoChat();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/video']);
  });
});
