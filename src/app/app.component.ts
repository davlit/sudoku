import { Component } from '@angular/core';

import { TITLE, MAJOR_VERSION, VERSION, SUB_VERSION, COPYRIGHT } from './common/common'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = TITLE;
  version = 'v' + MAJOR_VERSION + '.' + VERSION + '.' + SUB_VERSION;
  copyright = COPYRIGHT;
}
