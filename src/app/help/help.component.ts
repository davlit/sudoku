import { Component, OnInit } from '@angular/core';

import { MAJOR_VERSION, VERSION, SUB_VERSION } from '../common/common';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
  // styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  version = MAJOR_VERSION + '.' + VERSION + '.' + SUB_VERSION;

  // test
  message = 'Test: This is help component.'

}
