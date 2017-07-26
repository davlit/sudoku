// console.log('Creation web worker loaded.');

import { Difficulty } from '../../app/model/difficulty';
import { CreationService } from './creation.service';

// prevent TypeScript compile error
const customPostMessage: any = postMessage;

// the worker has an instance of the CPU-intensive service
const creationService = new CreationService();

/**
 * onmessage executes when a posted message is received by the web worker.
 */
onmessage = (event: any) => {
  let difficulty: Difficulty = event.data;
  // let createdSudoku: string = undefined;

// console.info('creation.worker.onmessage difficullty: ' + difficulty);
console.info('\nCreation started in background ...')

  // perform CPU-intense task in web worker
  let createdSudoku: string = creationService.createSudoku(difficulty);

// console.info('creation.worker created diff: ' + difficulty);
console.info('\nCreation background completed')

  // post a message with result back to the requester (AppComponent)
  customPostMessage(createdSudoku);
  // customPostMessage('A B C');
};
