/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClubManageComponent } from './club-manage.component';

describe('ClubManageComponent', () => {
  let component: ClubManageComponent;
  let fixture: ComponentFixture<ClubManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
