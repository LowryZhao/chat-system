import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of({ id: '1', username: 'user' })),
      register: jasmine.createSpy('register').and.returnValue(of({ id: '2', username: 'newuser' })),
      saveUser: jasmine.createSpy('saveUser')
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login and navigate on success', fakeAsync(() => {
    component.username = 'user';
    component.password = '123';
    component.isRegister = false;

    component.login();
    tick(300);

    expect(mockAuthService.login).toHaveBeenCalledWith('user', '123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/groups']);
    expect(component.loading).toBeFalse();
  }));

  it('should show error on login failure', fakeAsync(() => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('401')));
    component.username = 'wrong';
    component.password = 'wrong';
    component.login();
    tick();

    expect(component.error).toBe('Login failed. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should switch back to login mode after registration', fakeAsync(() => {
    component.isRegister = true;
    component.username = 'newuser';
    component.email = 'new@example.com';
    component.password = '123';

    component.register();
    tick();

    expect(mockAuthService.register).toHaveBeenCalledWith('newuser', 'new@example.com', '123');
    expect(component.isRegister).toBeFalse();
    expect(component.error).toBe('Registration successful. Please login.');
  }));

  it('should show error if registration fails', fakeAsync(() => {
    mockAuthService.register.and.returnValue(throwError(() => new Error('500')));

    component.isRegister = true;
    component.username = 'baduser';
    component.email = 'bad@example.com';
    component.password = '123';

    component.register();
    tick();

    expect(component.error).toBe('Registration failed. Please try again.');
    expect(component.loading).toBeFalse();
  }));

  it('should toggle between login and register mode', () => {
    component.isRegister = false;
    component.toggleMode();
    expect(component.isRegister).toBeTrue();

    component.toggleMode();
    expect(component.isRegister).toBeFalse();
  });
});
