import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { HelpComponent } from './help/help.component';
import { PlayComponent } from './play/play.component';
import { PrintComponent } from './print/print.component';
import { CreationService }         from './model/creation.service';
import { CacheService }         from './model/cache.service';
import { WebWorkerClient }         from './model/web-worker-client';
import { CounterComponent } from './play/counter/counter.component';

import { CreationModule } from './creation.module';
import { SharedModule } from './shared.module';

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
    AppRoutingModule,
    CreationModule,
    SharedModule
  ],
  providers: [
    CacheService, 
    CreationService, 
    WebWorkerClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
