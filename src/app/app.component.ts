import { Component, OnInit } from '@angular/core';

import { TITLE, MAJOR_VERSION, VERSION, SUB_VERSION, COPYRIGHT } from './common/common'; 
import { CacheService } from './model/cache.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    // this.cacheService.clearCache();
    // let cacheKeys = this.cacheService.allCacheKeys();
    // let s = 'cache keys: ';
    // for (let i = 0; i < cacheKeys.length; i++) {
    //   s += cacheKeys[i] + ' ';
    // }
    console.log('Cache: ' + this.cacheService.allCacheKeys());
    // console.log('cache keys: ' + this.cacheService.allCacheKeys());
    this.cacheService.replenishCache();
    // console.log('cache keys: ' + this.cacheService.allCacheKeys());
    console.log('Cache: ' + this.cacheService.allCacheKeys());
    // cacheKeys = this.cacheService.allCacheKeys();
    // s = 'cache keys: ';
    // for (let i = 0; i < cacheKeys.length; i++) {
    //   s += cacheKeys[i] + ' ';
    // }
    // console.log(s);


//     // child class/object -- like HintCounts
//     let object2 = new Class2('four', 'five', 'six');
// console.log('object2: ', object2);
// console.log('object2.concat(): ' + object2.concat());
// console.log('object2.toString(): ' + object2.toString());

//     // store object
//     localStorage.setItem('object2', object2.serialize());
// // console.log('object2 from storage: ' + localStorage.getItem('object2'));
// // console.log('object2 from storage: ' + JSON.parse(localStorage.getItem('object2')));

//     // retrieve/reconstitute object
//     let retObject2 = Class2.deserialize(localStorage.getItem('object2'));
// console.log('retObject2: ', object2);
// console.log('retObject2.concat(): ' + retObject2.concat());
// console.log('retObject2.toString(): ' + retObject2.toString());

//     // get array of keys
//     let s = 'localStorageKeys: ';
//     for (let value in this.allLocalStorageKeys()) {
//       s += value + ', ';
//     }
// console.log('keys: ' + s);

//     // parent class -- like Puzzle
//     let object1 = new Class1(1, 2, 3, object2);
// console.log('object1: ', object1);
// console.log('object2: ', object1.getObj2());
// console.log('object1.concat(): ' + object1.sum());
// console.log('object1.toString(): ' + object1.toString());

//     // store object
//     localStorage.setItem('object1', object1.serialize());
// // console.log('object1 from storage: ' + localStorage.getItem('object1'));
// // console.log('object1 from storage: ' + JSON.parse(localStorage.getItem('object1')));

//     // retrieve/reconstitute object
//     let retObject1 = Class1.deserialize(localStorage.getItem('object1'));
// console.log('retObject1: ', object1);
// console.log('retObject1.sum(): ' + retObject1.sum());
// console.log('retObject1.toString(): ' + retObject1.toString());

//     // get array of keys
//     s = 'localStorageKeys: ';
//     for (let value in this.allLocalStorageKeys()) {
//       s += value + ', ';
//     }
// console.log('keys: ' + s);

// console.log('**********************');
  } // onInit()

  allLocalStorageKeys() : {}  {
    let archive = {}; // Notice change here
    let keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      archive[keys[i]] = localStorage.getItem(keys[i]);
    }

    return archive;
  }

  // storeInstance(key: string, instance: {}) {
  //   localStorage.setItem(key, instance.serialize());
  // }

}

class Class1 {
  constructor(
    private one: number,
    private two: number,
    private three: number,
    private obj2: Class2
  ) {}

  getObj2() {
    return this.obj2;
  }

  sum() : number {
    return this.one + this.two + this.three;
  }

  toString() {
    return this.one + ' ' + this.two + ' ' + this.three + ' '
        + this.obj2.toString();
  }

  serialize() : string {
    return JSON.stringify({
      "one": this.one,
      "two": this.two,
      "three": this.three,
      "obj2": this.obj2.serialize()
    });
  }

  static deserialize(object1Data) : Class1 {
    let data = JSON.parse(object1Data);
    let object1 = new Class1(data.one, data.two, data.three, 
        Class2.deserialize(data.obj2));
    return object1;
  }

}

class Class2 {
  constructor(
    private _4: string,
    private _5: string,
    private _6: string
  ) {}

  concat() : string {
    return this._4 + ' ' + this._5 + ' ' + this._6;
  }

  toString() : string {
    return this._4 + ' ' + this._5 + ' ' + this._6;
  }

  serialize() : string {
    return JSON.stringify({
      "_4": this._4,
      "_5": this._5,
      "_6": this._6,
    });
  }

  static deserialize(object2Data) : Class2 {
    let data = JSON.parse(object2Data);
    let object2 = new Class2(data._4, data._5, data._6);
    return object2;
  }

}
