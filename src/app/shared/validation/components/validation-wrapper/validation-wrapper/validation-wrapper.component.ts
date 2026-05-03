import { Component, contentChild, effect, signal } from '@angular/core';
import { FormField, ValidationError } from '@angular/forms/signals';
import { validationMessageHelper } from '../../../helpers/validation-message.helper';

@Component({
  selector: 'validation-wrapper',
  templateUrl: './validation-wrapper.component.html',
  styleUrl: './validation-wrapper.component.css',
  host: {
    class: 'validation-wrapper',
  },
})
export class ValidationWrapperComponent {
  public readonly formChild = contentChild(FormField);
  public readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (!this.formChild()) return;

      const isTouched = this.formChild()!.state().touched();
      const errors = this.formChild()!.errors();
      const hasErrors = errors!.length > 0;

      this.error.set(
        isTouched && hasErrors ? this.getErrorMessage(errors![0]!) : null,
      );
    });
  }

  private getErrorMessage(error: ValidationError): string {
    return validationMessageHelper(error);
  }
}
