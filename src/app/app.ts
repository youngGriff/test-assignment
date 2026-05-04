import { Component } from '@angular/core';
import { GameScreenComponent } from './game/components/game-screen/game-screen.component';

@Component({
  selector: 'app-root',
  imports: [GameScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
