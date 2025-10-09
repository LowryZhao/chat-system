import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';
import { ChannelService } from '../../services/channel';
import { UserService } from '../../services/user';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  const mockAuthService = {
    getUser: () => ({ id: 'admin123' }),
    hasRole: jasmine.createSpy('hasRole').and.returnValue(true),
    isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true)
  };

  const mockGroupService = {
    createGroup: jasmine.createSpy('createGroup').and.returnValue(of({})),
    addUserToGroup: jasmine.createSpy('addUserToGroup').and.returnValue(of({})),
    removeUserFromGroup: jasmine.createSpy('removeUserFromGroup').and.returnValue(of({})),
    deleteGroup: jasmine.createSpy('deleteGroup').and.returnValue(of({}))
  };

  const mockChannelService = {
    createChannel: jasmine.createSpy('createChannel').and.returnValue(of({})),
    addUserToChannel: jasmine.createSpy('addUserToChannel').and.returnValue(of({})),
    removeUserFromChannel: jasmine.createSpy('removeUserFromChannel').and.returnValue(of({})),
    deleteChannel: jasmine.createSpy('deleteChannel').and.returnValue(of({}))
  };

  const mockUserService = {
    createUserByAdmin: jasmine.createSpy('createUserByAdmin').and.returnValue(of({})),
    removeUser: jasmine.createSpy('removeUser').and.returnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GroupService, useValue: mockGroupService },
        { provide: ChannelService, useValue: mockChannelService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createUser()', () => {
    component.newUserUsername = 'test';
    component.newUserEmail = 't@example.com';
    component.newUserPassword = '123';
    component.createUser();
    expect(mockUserService.createUserByAdmin).toHaveBeenCalled();
  });

  it('should call removeUser()', () => {
    component.removeUserId = '123';
    component.removeUser();
    expect(mockUserService.removeUser).toHaveBeenCalled();
  });

  it('should call createGroup()', () => {
    component.groupName = 'Test Group';
    component.createGroup();
    expect(mockGroupService.createGroup).toHaveBeenCalled();
  });

  it('should call addUserToGroup()', () => {
    component.targetGroupId = 'g1';
    component.targetGroupUserId = 'u1';
    component.addUserToGroup();
    expect(mockGroupService.addUserToGroup).toHaveBeenCalled();
  });

  it('should call removeUserFromGroup()', () => {
    component.targetGroupId = 'g1';
    component.targetGroupUserId = 'u1';
    component.removeUserFromGroup();
    expect(mockGroupService.removeUserFromGroup).toHaveBeenCalled();
  });

  it('should call deleteGroup()', () => {
    component.deleteGroupId = 'g1';
    component.deleteGroup();
    expect(mockGroupService.deleteGroup).toHaveBeenCalled();
  });

  it('should call createChannel()', () => {
    component.channelName = 'ch1';
    component.channelGroupId = 'g1';
    component.createChannel();
    expect(mockChannelService.createChannel).toHaveBeenCalled();
  });

  it('should call addUserToChannel()', () => {
    component.targetChannelId = 'c1';
    component.targetChannelUserId = 'u1';
    component.addUserToChannel();
    expect(mockChannelService.addUserToChannel).toHaveBeenCalled();
  });

  it('should call removeUserFromChannel()', () => {
    component.targetChannelId = 'c1';
    component.targetChannelUserId = 'u1';
    component.removeUserFromChannel();
    expect(mockChannelService.removeUserFromChannel).toHaveBeenCalled();
  });

  it('should call deleteChannel()', () => {
    component.deleteChannelId = 'c1';
    component.deleteChannel();
    expect(mockChannelService.deleteChannel).toHaveBeenCalled();
  });
});
