console.log('Creation web worker loaded.');

import { Difficulty } from '../../app/model/difficulty';
import { CreationService } from './/creation.service';

// prevent TypeScript compile error
const customPostMessage: any = postMessage;

// the worker has an instance of the CPU-intensive service
const creationService = new CreationService();

// the onmessage function executes when a message is posted to the web worker.
onmessage = (event: any) => {
  let difficulty: Difficulty = event.data;
  let createdSudoku: string = undefined;

  // perform the CPU-intense task
  // createdSudoku = creationService.TODO()

  // post a message with result back to the requester (AppComponent)
  customPostMessage(createdSudoku);
};

