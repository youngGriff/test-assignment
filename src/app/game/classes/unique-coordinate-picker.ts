import { GameTileCoordinate } from '../interfaces/game-tile-coordinate.interface';

export class UniqueCoordinatePicker<T> {
  private availableCoords: GameTileCoordinate[] = [];

  constructor(matrix: T[][]) {
    this.initializeCoordinates(matrix);
  }

  /**
   * Scans the 2D matrix and builds a flat list of all index pairs.
   */
  private initializeCoordinates(matrix: T[][]): void {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        this.availableCoords.push([r, c]);
      }
    }
    this.shuffle();
  }

  /**
   * Shuffles the coordinates array once using the Fisher-Yates algorithm.
   */
  private shuffle(): void {
    for (let i = this.availableCoords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.availableCoords[i], this.availableCoords[j]] = [
        this.availableCoords[j],
        this.availableCoords[i],
      ];
    }
  }

  /**
   * Returns a unique random coordinate tuple [row, col].
   * Returns null if all coordinates have been exhausted.
   */
  public getNextCoordinate(): [number, number] | null {
    if (this.availableCoords.length === 0) {
      return null;
    }
    // pop() takes the last element, guaranteeing O(1) complexity
    return this.availableCoords.pop()!;
  }

  /**
   * Checks how many unique coordinates are left.
   */
  public get remainingCount(): number {
    return this.availableCoords.length;
  }
}
