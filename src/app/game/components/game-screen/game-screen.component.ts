import { Component, computed, effect, inject, untracked } from '@angular/core';
import { GameTableComponent } from '../game-table/game-table.component';
import { FormField, FormRoot } from '@angular/forms/signals';
import { GameStateForm } from '../../forms/game-state.form';
import { ValidationWrapperComponent } from '../../../shared/validation/components/validation-wrapper/validation-wrapper/validation-wrapper.component';
import { GameState } from '../../classes/game-state';
import { GameMode } from '../../enums/game-mode.enum';
import { GameTileCoordinate } from '../../interfaces/game-tile-coordinate.interface';
import { Dialog } from '@angular/cdk/dialog';
import {
  GameResultModalComponent,
  GameResultModalData,
} from '../game-result-modal/game-result-modal.component';

@Component({
  selector: 'game-screen',
  imports: [
    GameTableComponent,
    FormField,
    FormRoot,
    ValidationWrapperComponent,
  ],
  templateUrl: './game-screen.component.html',
  styleUrl: './game-screen.component.css',
})
export class GameScreenComponent {
  private readonly dialog = inject(Dialog);

  public readonly formState = new GameStateForm(() => this.onStart());
  public readonly form = this.formState.form;

  public readonly gameState = new GameState({ boardSize: 10, scoreToWin: 10 });
  public readonly userScore = this.gameState.userScore;
  public readonly computerScore = this.gameState.computerScore;

  public readonly disableStartBtn = computed(() => {
    return this.gameState.mode() === GameMode.Playing;
  });

  constructor() {
    effect(() => {
      if (this.gameState.mode() === GameMode.Finished) {
        const scoreData = untracked<GameResultModalData>(() => ({
          userScore: this.userScore(),
          computerScore: this.computerScore(),
        }));
        this.dialog.open<unknown, GameResultModalData>(
          GameResultModalComponent,
          { data: scoreData },
        );
      }
    });
  }

  public onStart(): void {
    this.gameState.start({ highlightingTime: this.form().value().time! });
  }

  public onTileClick(coords: GameTileCoordinate): void {
    this.gameState.userClickedTile(coords);
  }
}
