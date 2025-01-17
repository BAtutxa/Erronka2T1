import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZerbitzuaPage } from './zerbitzua.page';

describe('ZerbitzuaPage', () => {
  let component: ZerbitzuaPage;
  let fixture: ComponentFixture<ZerbitzuaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ZerbitzuaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
