import { Component } from '@angular/core';

/**
 * Generated class for the GomofooterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'gomofooter',
  templateUrl: 'gomofooter.html'
})
export class GomofooterComponent {

  text: string;

  constructor() {
    console.log('Hello GomofooterComponent Component');
    this.text = 'Hello World';
  }

}
