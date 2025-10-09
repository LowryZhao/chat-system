import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelListComponent } from './channel-list';
import { AuthService } from '../../services/auth';
import { ChannelService } from '../../services/channel';
import { GroupService } from '../../services/group';
import { of } from 'rxjs';

describe('ChannelListComponent', () => {
  let component: ChannelListComponent;
  let fixture: ComponentFixture<ChannelListComponent>;

  const mockAuthService = {
    getUser: jasmine.createSpy('getUser').and.returnValue({ id: 'user1' }),
    hasRole: jasmine.createSpy('hasRole').and.returnValue(true),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true)
  };

  const mockGroupService = {
    getUserGroups: jasmine.createSpy('getUserGroups').and.returnValue(of([{ id: 'g1', name: 'Group 1' }]))
  };

  const mockChannelService = {
    getGroupChannels: jasmine.createSpy('getGroupChannels').and.returnValue(of([{ id: 'c1', name: 'General' }])),
    createChannel: jasmine.createSpy('createChannel').and.returnValue(of({})),
    leaveChannel: jasmine.createSpy('leaveChannel').and.returnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GroupService, useValue: mockGroupService },
        { provide: ChannelService, useValue: mockChannelService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadChannels() on ngOnInit', () => {
    const spy = spyOn(component, 'loadChannels');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call createChannel()', () => {
    component.newChannelName = 'Test Channel';
    component.selectedGroupId = 'g1';
    component.createChannel();
    expect(mockChannelService.createChannel).toHaveBeenCalled();
  });

  it('should call leaveChannel()', () => {
    component.selectedGroupId = 'g1';
    component.leaveChannel('c1');
    expect(mockChannelService.leaveChannel).toHaveBeenCalledWith('c1', 'user1');
  });

  it('should call onGroupChange()', () => {
    const spy = spyOn(component as any, 'fetchChannelsByGroup');
    component.selectedGroupId = 'g1';
    component.onGroupChange();
    expect(spy).toHaveBeenCalledWith('g1', 'user1');
  });

  it('should change selectedChannelId when openChat() is called', () => {
    component.openChat('c123');
    expect(component.selectedChannelId).toBe('c123');
  });
});
