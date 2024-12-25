import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InbentarioPage } from './inbentario.page';

describe('InbentarioPage', () => {
  let component: InbentarioPage;
  let fixture: ComponentFixture<InbentarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InbentarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
