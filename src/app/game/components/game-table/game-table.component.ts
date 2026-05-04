import { Component, input, output } from '@angular/core';
import { GameTileComponent } from '../game-tile/game-tile.component';
import { GameEngine } from '../../classes/game-engine';
import { GameTileCoordinate } from '../../interfaces/game-tile-coordinate.interface';

@Component({
  selector: 'game-table',
  imports: [GameTileComponent],
  templateUrl: './game-table.component.html',
  styleUrl: './game-table.component.css',
})
export class GameTableComponent {
  public readonly gameState = input.required<GameEngine>();
  public readonly tileClick = output<GameTileCoordinate>();

  public onTileClick(coord: GameTileCoordinate) {
    this.tileClick.emit(coord);
  }
}
