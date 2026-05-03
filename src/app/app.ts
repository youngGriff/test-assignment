import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameScreenComponent } from './game/components/game-screen/game-screen.component';

@Component({
  selector: 'app-root',
  imports: [GameScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
