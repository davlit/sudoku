import { Component, OnInit } from '@angular/core';

import { TITLE, MAJOR_VERSION, VERSION, SUB_VERSION, COPYRIGHT } from '../common/common'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  abc = 'abc';
  title = TITLE;
  version = 'v' + MAJOR_VERSION + '.' + VERSION + '.' + SUB_VERSION;
  copyright = COPYRIGHT;
}
