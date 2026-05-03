import { signal } from '@angular/core';
import { form, max, min, required } from '@angular/forms/signals';

interface GameState {
  time: number | null;
}

export class GameStateForm {
  public readonly formState = signal<GameState>({ time: null });

  constructor(private readonly action: () => void) {}

  public readonly form = form(
    this.formState,
    (schemaPath) => {
      min(schemaPath.time, 1);
      max(schemaPath.time, 100_000);
      required(schemaPath.time);
    },
    {
      submission: {
        action: async () => this.action(),
        onInvalid: () => this.form().markAsTouched(),
      },
    },
  );
}
