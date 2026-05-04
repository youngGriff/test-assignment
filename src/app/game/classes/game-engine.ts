import { signal } from '@angular/core';
import { GameCellStatus } from '../enums/game-cell-status.enum';
import { GameMode } from '../enums/game-mode.enum';
import { UniqueCoordinatePicker } from './unique-coordinate-picker';
import { GameTileCoordinate } from '../interfaces/game-tile-coordinate.interface';
import {
  GameOptions,
  GameStartOptions,
} from '../interfaces/game-options.interface';

export class GameEngine {
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
    private readonly gameOptions: GameOptions = {
      boardSize: 10,
      scoreToWin: 10,
    },
  ) {
    this.resetGrid();
    this.validateGameOptions(gameOptions);
  }

  public start({ highlightingTime }: GameStartOptions): void {
    if (this.mode() === GameMode.Playing) {
      return;
    }

    if (highlightingTime <= 0) {
      throw new Error('Highlighting time must be greater than 0');
    }

    this.resetGrid();
    this.uniqueCoordinatePicker = new UniqueCoordinatePicker(this.grid());

    this.highlightingCoordinate.set(null);
    this._userScore.set(0);
    this._computerScore.set(0);
    this.highlightingTime = highlightingTime;
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
      this._userScore() >= this.gameOptions.scoreToWin ||
      this._computerScore() >= this.gameOptions.scoreToWin
    );
  }

  private resetGrid(): void {
    this.grid.set(
      [...Array(this.gameOptions.boardSize)].map(() =>
        [...Array(this.gameOptions.boardSize)].map(() => GameCellStatus.Empty),
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

  private validateGameOptions({ boardSize, scoreToWin }: GameOptions): void {
    if (boardSize <= 0) {
      throw new Error('Board size must be greater than 0');
    }

    if (scoreToWin <= 0) {
      throw new Error('Score to win must be greater than 0');
    }

    if (boardSize * boardSize < scoreToWin * 2) {
      throw new Error('Board size is too small for the given score to win');
    }
  }
}
