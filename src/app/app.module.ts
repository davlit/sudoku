import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { PlayComponent } from './play/play.component';
import { PrintComponent } from './print/print.component';
// import { CreationModule }  from './creation/creation.module';
import { CacheService }         from './model/cache.service';
// import { WebWorkerClient }         from './model/web-worker-client';
// import { WebWorkerService }         from 'angular2-web-worker';
import { CounterComponent } from './play/counter/counter.component';

// import { SharedModule } from './shared.module';

import { SudokuService }         from './model/sudoku.service';
// import { SudokuModel }         from './model/sudoku.model';
import { ActionLogService }      from './action/action-log.service';
import { HintService }        from './hint/hint.service';
import { HintLogService }        from './hint/hint-log.service';
import { CreationService }        from './creation/creation.service';

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
    AppRoutingModule//,
    // CreationModule//,
    // SharedModule
  ],
  providers: [
    CacheService, 
    // WebWorkerClient
    // WebWorkerService
    SudokuService,
      // SudokuModel, 
      ActionLogService, 
    HintService, 
      HintLogService,
    CreationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
