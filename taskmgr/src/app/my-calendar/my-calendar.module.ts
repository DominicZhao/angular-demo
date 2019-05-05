import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MyCalendarRoutingModule } from './my-calendar-routing.module';

import { CalendarHomeComponent } from './calendar-home/calendar-home.component';

registerLocaleData(localeZh);

@NgModule({
  declarations: [CalendarHomeComponent],
  imports: [
    SharedModule,
    MyCalendarRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class MyCalendarModule { }
