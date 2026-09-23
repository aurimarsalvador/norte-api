import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Icon } from './icon';
import { FieldStatus } from './text-field';

export interface SelectOption {
  value: string;
  label: string;
}

let proximoId = 0;

/** Select nativo com a mesma aparencia do norte-text-field. O valor e sempre texto. */
@Component({
  selector: 'norte-select-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectField), multi: true },
  ],
  template: `
    @if (label()) {
      <label class="rotulo" [for]="id">{{ label() }}</label>
    }
    <div
      class="caixa"
      [class.caixa--valido]="status() === 'valid'"
      [class.caixa--erro]="status() === 'error'"
    >
      <select
        [id]="id"
        [class.vazio]="!valor()"
        [disabled]="desabilitado()"
        [attr.aria-invalid]="status() === 'error'"
        [attr.aria-describedby]="subtexto() ? id + '-sub' : null"
        (change)="aoEscolher($event)"
        (blur)="aoTocar()"
      >
        <option value="" disabled [selected]="!valor()">{{ placeholder() }}</option>
        @for (opcao of options(); track opcao.value) {
          <option [value]="opcao.value" [selected]="opcao.value === valor()">
            {{ opcao.label }}
          </option>
        }
      </select>
      <div class="acessorios" aria-hidden="true">
        @if (status() === 'valid') {
          <span class="selo"><norte-icon name="check" [size]="15" [strokeWidth]="3" /></span>
        }
        <norte-icon name="chevron-down" />
      </div>
    </div>
    @if (subtexto()) {
      <div class="sub" [id]="id + '-sub'" [class.sub--erro]="status() === 'error'">
        {{ subtexto() }}
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rotulo {
      color: var(--text-strong);
      font-size: var(--fs-label);
      font-weight: 600;
      line-height: var(--lh-label);
    }

    .caixa {
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-md);
      height: var(--control-h);
      position: relative;
      transition:
        border-color var(--dur-fast),
        box-shadow var(--dur-base) var(--ease-out);
    }

    .caixa:focus-within {
      border-color: var(--border-focus);
      box-shadow: var(--focus-ring);
    }

    .caixa--valido,
    .caixa--valido:focus-within {
      border-color: var(--green-600);
    }

    .caixa--erro,
    .caixa--erro:focus-within {
      border-color: var(--error-600);
    }

    select {
      appearance: none;
      background: transparent;
      border: none;
      color: var(--text-strong);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 17px;
      height: 100%;
      outline: none;
      padding: 0 48px 0 16px;
      width: 100%;
    }

    select.vazio {
      color: var(--text-muted);
    }

    option {
      color: var(--text-strong);
    }

    .acessorios {
      align-items: center;
      bottom: 0;
      color: var(--text-muted);
      display: flex;
      gap: 6px;
      pointer-events: none;
      position: absolute;
      right: 12px;
      top: 0;
    }

    .selo {
      background: var(--green-100);
      border-radius: 999px;
      color: var(--green-700);
      display: grid;
      height: 24px;
      place-items: center;
      width: 24px;
    }

    .sub {
      color: var(--text-muted);
      font-size: var(--fs-small);
      line-height: var(--lh-small);
    }

    .sub--erro {
      color: var(--error-600);
    }
  `,
})
export class SelectField implements ControlValueAccessor {
  readonly label = input('');
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input('Selecione');
  readonly hint = input('');
  readonly status = input<FieldStatus>('idle');
  /** Substitui o hint quando o status e erro. */
  readonly message = input('');

  protected readonly id = `campo-selecao-${++proximoId}`;
  protected readonly valor = signal('');
  protected readonly desabilitado = signal(false);

  protected readonly subtexto = computed(() =>
    this.status() === 'error' && this.message() ? this.message() : this.hint(),
  );

  private onChange: (valor: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(valor: string | null): void {
    this.valor.set(valor ?? '');
  }

  registerOnChange(fn: (valor: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.desabilitado.set(desabilitado);
  }

  protected aoEscolher(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.valor.set(valor);
    this.onChange(valor);
  }

  protected aoTocar(): void {
    this.onTouched();
  }
}
