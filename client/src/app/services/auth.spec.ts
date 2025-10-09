import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = {
      post: jasmine.createSpy('post').and.returnValue(of({ username: 'super', roles: ['super_admin'] }))
    };

    (spyOn(localStorage, 'getItem') as any).and.callFake((key: string) => {
      if (key === 'user') return JSON.stringify({ username: 'mockUser', roles: ['user'] });
      return null;
    });
    (spyOn(localStorage, 'setItem') as any);
    (spyOn(localStorage, 'removeItem') as any);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save user to localStorage', () => {
    const user = { username: 'testUser' };
    service.saveUser(user);
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
  });

  it('should load user from localStorage', () => {
    const result = service.getUser();
    expect(result.username).toBe('mockUser');
  });

  it('should call HttpClient.post on login', () => {
    service.login('super', '123').subscribe((res) => {
      expect(res.username).toBe('super');
    });
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/login',
      { username: 'super', password: '123' }
    );
  });

  it('should call HttpClient.post on register', () => {
    service.register('a', 'a@a.com', '123').subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/users/register',
      { username: 'a', email: 'a@a.com', password: '123' }
    );
  });

  it('should clear user and remove from localStorage on logout', () => {
    service.saveUser({ username: 'super' });
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should return true for isAuthenticated when user exists', () => {
    service.saveUser({ username: 'super' });
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false for isAuthenticated when no user', () => {
    (localStorage.getItem as any).and.returnValue(null);
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should correctly identify user roles', () => {
    service.saveUser({ username: 'super', roles: ['super_admin', 'group_admin', 'user'] });
    expect(service.hasRole('super_admin')).toBeTrue();
    expect(service.isSuperAdmin()).toBeTrue();
    expect(service.isGroupAdmin()).toBeTrue();
    expect(service.isUser()).toBeTrue();
  });

  it('should return false for missing roles', () => {
    service.saveUser({ username: 'super', roles: [] });
    expect(service.hasRole('admin')).toBeFalse();
  });
});
