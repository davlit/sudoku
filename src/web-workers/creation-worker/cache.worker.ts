import { CacheManager } from './cache.manager';

// prevent TypeScript compile error
const customPostMessage: any = postMessage;

// the worker has an instance of the CPU-intensive service
const cacheManager = new CacheManager();

// export class CacheWorker {

/**
 * Some foreground function with a reference to web worker (this file) calls
 * the worker's postMessage function with an event object which is the message.
 * This event is received by the worker (this file) and event.data contains
 * the message to which the worker responds in background.
 * 
 * When a worker (this file) receives an event, the onmessage function is
 * executed and some other function(s) are executed in background. After any 
 * functions complete, the worker posts a response message.
 */

/**
 * onmessage executes when a posted message is received by the web worker.
 */
onmessage = (event: any) => {
  // let difficulty: Difficulty = event.data;

console.info('\nonmessage 1');    
  // perform CPU-intense task in web worker
  cacheManager.replenishCache();

  // post a message with result back to the requester (AppComponent)
  customPostMessage('Cache replenished');
};
// }
