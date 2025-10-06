import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockUser = { id: '1', username: 'super', roles: ['super_admin'] };

    service.login('super', '123').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should register successfully', () => {
    const mockNewUser = { username: 'newuser', email: 'new@example.com', password: '123' };

    service.register('newuser', 'new@example.com', '123').subscribe((user) => {
      expect(user.username).toBe('newuser');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockNewUser);
  });
});
