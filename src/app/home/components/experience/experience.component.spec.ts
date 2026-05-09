import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ScrollService } from "@shared/services/scroll.service";
import { ExperienceComponent } from "./experience.component";

describe("ExperienceComponent", () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceComponent],
      providers: [ScrollService],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
