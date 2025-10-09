import { TestBed } from '@angular/core/testing';
import { GroupService, Group } from './group';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GroupService', () => {
  let service: GroupService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      post: jasmine.createSpy('post').and.returnValue(of({})),
      get: jasmine.createSpy('get').and.returnValue(of([])),
      request: jasmine.createSpy('request').and.returnValue(of({}))
    };

    TestBed.configureTestingModule({
      providers: [
        GroupService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(GroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.post on createGroup()', () => {
    service.createGroup('Group A', 'admin1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/groups/create',
      { name: 'Group A', adminId: 'admin1' }
    );
  });

  it('should call HttpClient.get on getUserGroups()', () => {
    service.getUserGroups('u1').subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith('http://localhost:3000/api/groups/user/u1');
  });

  it('should call HttpClient.get on getAllGroups()', () => {
    service.getAllGroups().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith('http://localhost:3000/api/groups/all');
  });

  it('should call HttpClient.post on addUserToGroup()', () => {
    service.addUserToGroup('g1', 'admin1', 'user1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/groups/g1/add-user',
      { adminId: 'admin1', userId: 'user1' }
    );
  });

  it('should call HttpClient.post on removeUserFromGroup()', () => {
    service.removeUserFromGroup('g1', 'admin1', 'user1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/groups/g1/remove-user',
      { adminId: 'admin1', userId: 'user1' }
    );
  });

  it('should call HttpClient.request on deleteGroup()', () => {
    service.deleteGroup('g1', 'admin1').subscribe();
    expect(mockHttp.request).toHaveBeenCalledWith(
      'delete',
      'http://localhost:3000/api/groups/g1',
      { body: { adminId: 'admin1' } }
    );
  });
});
