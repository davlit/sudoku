import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BusyModule } from 'angular2-busy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { PlayComponent } from './play/play.component';
import { PrintComponent } from './print/print.component';
import { SudokuService }         from './model/sudoku.service';
import { CreationService }         from './model/creation.service';
import { CacheService }         from './model/cache.service';
import { SudokuModel }         from './model/sudoku.model';
import { ActionLog }      from './action/actionLog';
import { HintLog }        from './hint/hintLog';
import { HintService }        from './hint/hint.service';
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
    // BusyModule,
    AppRoutingModule
 ],
  providers: [SudokuService, CreationService, HintService, CacheService, ActionLog, HintLog],
  bootstrap: [AppComponent]
})
export class AppModule { }
