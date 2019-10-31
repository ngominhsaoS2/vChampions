/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RankSmComponent } from './rank-sm.component';

describe('RankSmComponent', () => {
  let component: RankSmComponent;
  let fixture: ComponentFixture<RankSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
