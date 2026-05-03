import { Component, input, output } from '@angular/core';
import { GameTileComponent } from '../game-tile/game-tile.component';
import { GameState } from '../../classes/game-state';
import { GameTileCoordinate } from '../../interfaces/game-tile-coordinate.interface';

@Component({
  selector: 'game-table',
  imports: [GameTileComponent],
  templateUrl: './game-table.component.html',
  styleUrl: './game-table.component.css',
})
export class GameTableComponent {
  public readonly gameState = input.required<GameState>();
  public readonly tileClick = output<GameTileCoordinate>();

  public onTileClick(coord: GameTileCoordinate) {
    this.tileClick.emit(coord);
  }
}
