import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface GameResultModalData {
  userScore: number;
  computerScore: number;
}

@Component({
  selector: 'game-result-modal',
  imports: [],
  templateUrl: './game-result-modal.component.html',
  styleUrl: './game-result-modal.component.css',
})
export class GameResultModalComponent {
  public dialogRef = inject(DialogRef);

  public data = inject<GameResultModalData>(DIALOG_DATA);
  public label =
    this.data.userScore > this.data.computerScore
      ? 'You won!'
      : 'Computer won!';

  public onClose(): void {
    this.dialogRef.close();
  }
}
