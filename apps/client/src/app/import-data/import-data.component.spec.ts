import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportDataComponent } from './import-data.component';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('ImportDataComponent', () => {
  let component: ImportDataComponent;
  let fixture: ComponentFixture<ImportDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportDataComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ImportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
