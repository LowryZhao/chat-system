import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupListComponent } from './group-list';
import { GroupService } from '../../services/group';
import { AuthService } from '../../services/auth';
import { of } from 'rxjs';

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  const mockAuthService = {
    getUser: jasmine.createSpy('getUser').and.returnValue({ id: 'u1' }),
    hasRole: jasmine.createSpy('hasRole').and.callFake((role: string) => role === 'group_admin')
  };

  const mockGroupService = {
    getUserGroups: jasmine.createSpy('getUserGroups').and.returnValue(of([{ id: 'g1', name: 'Group 1' }])),
    getAllGroups: jasmine.createSpy('getAllGroups').and.returnValue(of([{ id: 'g2', name: 'Group 2' }])),
    addUserToGroup: jasmine.createSpy('addUserToGroup').and.returnValue(of({})),
    removeUserFromGroup: jasmine.createSpy('removeUserFromGroup').and.returnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: GroupService, useValue: mockGroupService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadData() on ngOnInit', () => {
    const spy = spyOn<any>(component, 'loadData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call addUserToGroup()', () => {
    component.addUserToGroup('g1', 'u2');
    expect(mockGroupService.addUserToGroup).toHaveBeenCalledWith('g1', 'u1', 'u2');
  });

  it('should call removeUserFromGroup()', () => {
    component.removeUserFromGroup('g1', 'u2');
    expect(mockGroupService.removeUserFromGroup).toHaveBeenCalledWith('g1', 'u1', 'u2');
  });

  it('should return true for isMember() if user is in members list', () => {
    const group = { id: 'g1', members: ['u1', 'u2'] } as any;
    const result = component.isMember(group);
    expect(result).toBeTrue();
  });

  it('should return false for isMember() if user is not in members list', () => {
    const group = { id: 'g1', members: ['u3'] } as any;
    const result = component.isMember(group);
    expect(result).toBeFalse();
  });
});
