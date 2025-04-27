import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexProfileComponent } from './index.component';

describe('IndexComponent', () => {
  let component: IndexProfileComponent;
  let fixture: ComponentFixture<IndexProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
