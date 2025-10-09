import { TestBed } from '@angular/core/testing';
import { UserService } from './user';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      post: jasmine.createSpy('post').and.returnValue(of({})),
      get: jasmine.createSpy('get').and.returnValue(of([]))
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.post on login()', () => {
    service.login('super', '123').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/login',
      { username: 'super', password: '123' }
    );
  });

  it('should call HttpClient.post on register()', () => {
    service.register('user1', 'user1@example.com', 'pass').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/register',
      { username: 'user1', email: 'user1@example.com', password: 'pass' }
    );
  });

  it('should call HttpClient.post on createUserByAdmin()', () => {
    service.createUserByAdmin('admin1', 'newUser', 'new@example.com', '123', 'user').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/create',
      {
        adminId: 'admin1',
        username: 'newUser',
        email: 'new@example.com',
        password: '123',
        role: 'user'
      }
    );
  });

  it('should call HttpClient.post on removeUser()', () => {
    service.removeUser('admin1', 'u1').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/remove',
      { adminId: 'admin1', userId: 'u1' }
    );
  });

  it('should call HttpClient.get on getAllUsers()', () => {
    service.getAllUsers().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith('http://localhost:3000/api/users/all');
  });
});
