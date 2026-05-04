import { Component, computed, input } from '@angular/core';
import { GameCellStatus } from '../../enums/game-cell-status.enum';

@Component({
  selector: 'game-tile',
  templateUrl: './game-tile.component.html',
  styleUrl: './game-tile.component.css',
  host: {
    class: 'game-tile',
    '[class.highlighting]': `isHighlighting()`,
    '[class.player-taken]': `isPlayerTaken()`,
    '[class.computer-taken]': `isComputerTaken()`,
  },
})
export class GameTileComponent {
  public readonly item = input.required<GameCellStatus>();
  public readonly coordinate = input.required<[number, number]>();
  public readonly highlightingCoordinate = input.required<
    [number, number] | null
  >();

  public readonly isHighlighting = computed(() => {
    if (!this.highlightingCoordinate()) {
      return false;
    }

    return (
      this.coordinate()[0] === this.highlightingCoordinate()![0] &&
      this.coordinate()[1] === this.highlightingCoordinate()![1]
    );
  });

  public readonly isPlayerTaken = computed(() => {
    return this.item() === GameCellStatus.TakenByPlayer;
  });

  public readonly isComputerTaken = computed(() => {
    return this.item() === GameCellStatus.TakenByComputer;
  });
}
