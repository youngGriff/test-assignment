import {
  Component,
  computed,
  contentChild,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { FormField, ValidationError } from '@angular/forms/signals';
import { validationMessageHelper } from '../../../helpers/validation-message.helper';
import { debouncedSignal } from '../../../../signals/debounced.signal';

@Component({
  selector: 'validation-wrapper',
  templateUrl: './validation-wrapper.component.html',
  styleUrl: './validation-wrapper.component.css',
  host: {
    class: 'validation-wrapper',
  },
})
export class ValidationWrapperComponent {
  public readonly error = signal<string | null>(null);
  private readonly formChild = contentChild(FormField);

  private readonly shouldShowError = computed(() => {
    if (!this.formChild()) return;

    const isTouched = this.formChild()!.state().touched();
    const errors = this.formChild()!.errors();
    const hasErrors = errors!.length > 0;

    return isTouched && hasErrors;
  });

  private readonly debounceShowError = debouncedSignal(
    this.shouldShowError,
    150,
  );

  constructor() {
    effect(() => {
      this.error.set(
        this.debounceShowError()
          ? untracked(() => this.getErrorMessage(this.formChild()!.errors()[0]))
          : null,
      );
    });
  }

  private getErrorMessage(error: ValidationError): string {
    return validationMessageHelper(error);
  }
}
