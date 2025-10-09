import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing';
import './app/testing-mocks';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
