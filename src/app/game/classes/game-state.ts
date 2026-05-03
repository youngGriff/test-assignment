import { signal } from '@angular/core';
import { GameCellStatus } from '../enums/game-cell-status.enum';
import { GameMode } from '../enums/game-mode.enum';
import { UniqueCoordinatePicker } from './unique-coordinate-picker';
import { GameTileCoordinate } from '../interfaces/game-tile-coordinate.interface';

export class GameState {
  public readonly grid = signal<Array<Array<GameCellStatus>>>([[]]);
  public readonly mode = signal<GameMode>(GameMode.Idle);
  public readonly highlightingCoordinate = signal<GameTileCoordinate | null>(
    null,
  );

  private readonly _userScore = signal(0);
  private readonly _computerScore = signal(0);

  public readonly userScore = this._userScore.asReadonly();
  public readonly computerScore = this._computerScore.asReadonly();

  private highlightingTime = 0;
  private highlightingCallbackId!: number;

  private uniqueCoordinatePicker!: UniqueCoordinatePicker<GameCellStatus>;

  constructor(
    private readonly gameStateOptions = { boardSize: 10, scoreToWin: 10 },
  ) {
    this.resetGrid();
  }

  public start(startOptions: { highlightingTime: number }): void {
    if (this.mode() === GameMode.Playing) {
      return;
    }

    this.resetGrid();
    this.uniqueCoordinatePicker = new UniqueCoordinatePicker(this.grid());

    this.highlightingCoordinate.set(null);
    this._userScore.set(0);
    this._computerScore.set(0);
    this.highlightingTime = startOptions.highlightingTime;
    this.mode.set(GameMode.Playing);
    this.tick();
  }

  public userClickedTile(coordinate: GameTileCoordinate): void {
    if (this.mode() !== GameMode.Playing) {
      return;
    }

    if (
      this.highlightingCoordinate() &&
      this.highlightingCoordinate()![0] === coordinate[0] &&
      this.highlightingCoordinate()![1] === coordinate[1]
    ) {
      this._userScore.update((prev) => prev + 1);
      this.updateGridCell(coordinate, GameCellStatus.TakenByPlayer);
      this.tick();
    }
  }

  private tick(): void {
    clearTimeout(this.highlightingCallbackId);

    if (this.highlightingCoordinate()) {
      this.updateGridCell(
        this.highlightingCoordinate()!,
        GameCellStatus.TakenByComputer,
      );
    }

    if (this.isGameOver()) {
      this.mode.set(GameMode.Finished);
      return;
    }

    this.highlightingCoordinate.set(
      this.uniqueCoordinatePicker.getNextCoordinate(),
    );

    this.highlightingCallbackId = setTimeout(() => {
      this._computerScore.update((prev) => prev + 1);
      this.tick();
    }, this.highlightingTime);
  }

  private isGameOver(): boolean {
    return (
      this._userScore() >= this.gameStateOptions.scoreToWin ||
      this._computerScore() >= this.gameStateOptions.scoreToWin
    );
  }

  private resetGrid(): void {
    this.grid.set(
      [...Array(this.gameStateOptions.boardSize)].map(() =>
        [...Array(this.gameStateOptions.boardSize)].map(
          () => GameCellStatus.Empty,
        ),
      ),
    );
  }

  private updateGridCell(
    coordinate: GameTileCoordinate,
    status: GameCellStatus,
  ): void {
    if (this.grid()[coordinate[0]][coordinate[1]] !== GameCellStatus.Empty) {
      return;
    }

    this.grid.update((prev) => {
      const newGrid = [...prev];
      newGrid[coordinate[0]][coordinate[1]] = status;
      return newGrid;
    });
  }
}
