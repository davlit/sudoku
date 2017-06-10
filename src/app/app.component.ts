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
    
  ngOnInit() {
    // // console.log('Cache: ' + this.cacheService.allCacheKeys());
    // this.cacheService.replenishCache();
    // // console.log('Cache: ' + this.cacheService.allCacheKeys());
    // for (let i of [0,1,2,3]) {
    //   this.cacheService.isSudokuAvailable(i);
    // }

    let cacheKeys: string[] = this.cacheService.getCacheKeys();

console.info('Cache keys before replenishment: ' + JSON.stringify(cacheKeys));

    this.cacheService.removeCacheItem('undefined');

console.info('Cache keys before replenishment: ' + JSON.stringify(cacheKeys));

    // this.cacheService.emptyCache();
    // cacheKeys = this.cacheService.getCacheKeys();
    // console.info('cp20 - cache keys: ' + JSON.stringify(cacheKeys));

    this.cacheService.replenishCache();

    // console.info('cp30 - cache keys after replenishment: ' + JSON.stringify(cacheKeys));

    // console.info('cp40 - cache easy: ' 
    //     + this.cacheService.getCacheSizeByDifficulty(Difficulty.EASY)) 
    // console.info('cp40 - cache medium: ' 
    //     + this.cacheService.getCacheSizeByDifficulty(Difficulty.MEDIUM)) 
    // console.info('cp40 - cache hard: ' 
    //     + this.cacheService.getCacheSizeByDifficulty(Difficulty.HARD)) 
    // console.info('cp40 - cache hardest: ' 
    //     + this.cacheService.getCacheSizeByDifficulty(Difficulty.HARDEST)) 
  } // onInit()

}
