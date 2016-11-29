import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { PlayComponent } from './play/play.component';
import { PrintComponent } from './print/print.component';
import { Sudoku }         from './model/sudoku';
import { ActionLog }      from './action/actionLog';
import { HintLog }        from './hint/hintLog';
import { CounterComponent } from './play/counter/counter.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HelpComponent,
    PlayComponent,
    PrintComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [Sudoku, ActionLog, HintLog],
  bootstrap: [AppComponent]
})
export class AppModule { }
