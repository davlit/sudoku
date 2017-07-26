import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';

// import { HomeComponent } from './home/home.component';
// import { HelpComponent } from './help/help.component';
// import { PlayComponent } from './play/play.component';
import { PrintComponent } from './print/print.component';
import { CacheService }         from './model/cache.service';
// import { CounterComponent } from './play/counter/counter.component';
import { SudokuService }         from './model/sudoku.service';
import { ActionLogService }      from './action/action-log.service';
import { HintService }        from './hint/hint.service';
import { HintLogService }        from './hint/hint-log.service';
// import { CreationService }        from '../web-workers/creation-worker/creation.service';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // HelpComponent,
    // PlayComponent,
    PrintComponent
    // CounterComponent
  ],
  imports: [    
    BrowserModule,
    FormsModule,
    // AppRoutingModule
    TooltipModule.forRoot()
  ],
  providers: [
    CacheService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
