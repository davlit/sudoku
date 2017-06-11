import { Component, OnInit } from '@angular/core';

import { TITLE, MAJOR_VERSION, VERSION, SUB_VERSION, COPYRIGHT } from './common/common'; 
import { Difficulty } from './model/difficulty';
import { CacheService } from './model/cache.service'; 
import { CreationService } from '../web-workers/creation-worker/creation.service'; 

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
    private cacheService: CacheService
  ) {}
    
  // on app startup, replenish cache    
  ngOnInit() {
    let cacheKeys: string[] = this.cacheService.getCacheKeys();

console.info('Cache keys before replenishment: ' + JSON.stringify(cacheKeys));

    // activate for maintenance
    // this.cacheService.removeCacheItem('undefined');
    // this.cacheService.emptyCache();
    // cacheKeys = this.cacheService.getCacheKeys();
    // console.info('Cache keys after maintenance:  + JSON.stringify(cacheKeys));

    this.cacheService.replenishCache();
  } // onInit()

}
