import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BezeroPage } from './bezero.page';

describe('BezeroPage', () => {
  let component: BezeroPage;
  let fixture: ComponentFixture<BezeroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BezeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
