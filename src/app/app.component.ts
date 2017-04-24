import { Component, OnInit } from '@angular/core';

import { TITLE, MAJOR_VERSION, VERSION, SUB_VERSION, COPYRIGHT } from './common/common'; 
import { CacheService } from './model/cache.service'; 
import { CreationService } from './creation/creation.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = TITLE;
  version = 'v' + MAJOR_VERSION + '.' + VERSION + '.' + SUB_VERSION;
  copyright = COPYRIGHT;

  constructor (
    // private localStorageService: LocalStorageService
    private cacheService: CacheService
  ) {}
    
  ngOnInit() {
    console.log('Cache: ' + this.cacheService.allCacheKeys());
    this.cacheService.replenishCache();
    // this.cacheService.startWebWorkerCacheReplenishment();
    console.log('Cache: ' + this.cacheService.allCacheKeys());
  } // onInit()

}
