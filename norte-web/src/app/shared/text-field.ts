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

export type FieldStatus = 'idle' | 'valid' | 'error';

let proximoId = 0;

/**
 * Campo de texto com validacao em tempo real: neutro, valido (borda verde e selo) ou com
 * erro (borda vermelha e alerta). Quem usa decide o status; o campo so o desenha.
 * Senha ganha o botao de mostrar e ocultar.
 */
@Component({
  selector: 'norte-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextField), multi: true },
  ],
  template: `
    @if (label()) {
      <label class="rotulo" [for]="id">{{ label() }}</label>
    }
    <div
      class="caixa"
      [class.caixa--valido]="status() === 'valid'"
      [class.caixa--erro]="status() === 'error'"
      [class.caixa--desabilitado]="desabilitado()"
    >
      <input
        [id]="id"
        [type]="type() === 'password' && revelada() ? 'text' : type()"
        [value]="valor()"
        [placeholder]="placeholder()"
        [attr.autocomplete]="autocomplete()"
        [attr.maxlength]="maxlength()"
        [disabled]="desabilitado()"
        [attr.aria-invalid]="status() === 'error'"
        [attr.aria-describedby]="subtexto() ? id + '-sub' : null"
        (input)="aoDigitar($event)"
        (blur)="aoTocar()"
      />
      <div class="acessorios">
        @if (status() === 'valid') {
          <span class="selo"><norte-icon name="check" [size]="15" [strokeWidth]="3" /></span>
        } @else if (status() === 'error') {
          <norte-icon name="circle-alert" color="var(--error-600)" />
        }
        @if (type() === 'password') {
          <button
            type="button"
            class="revelar"
            [attr.aria-label]="revelada() ? 'Ocultar senha' : 'Mostrar senha'"
            (click)="revelada.set(!revelada())"
          >
            <norte-icon [name]="revelada() ? 'eye-off' : 'eye'" />
          </button>
        }
      </div>
    </div>
    @if (subtexto()) {
      <div
        class="sub"
        aria-live="polite"
        [id]="id + '-sub'"
        [class.sub--erro]="status() === 'error'"
        [class.sub--valido]="status() === 'valid'"
      >
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
      align-items: center;
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-md);
      display: flex;
      height: var(--control-h);
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

    .caixa--erro:focus-within {
      box-shadow: var(--focus-ring-error);
    }

    .caixa--desabilitado {
      background: var(--cream-200);
    }

    input {
      background: transparent;
      border: none;
      color: var(--text-strong);
      flex: 1;
      font-family: var(--font-body);
      font-size: 17px;
      height: 100%;
      min-width: 0;
      outline: none;
      padding: 0 16px;
    }

    input::placeholder {
      color: var(--text-muted);
    }

    .acessorios {
      align-items: center;
      color: var(--text-muted);
      display: flex;
      gap: 6px;
      padding-right: 12px;
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

    .revelar {
      background: transparent;
      border: none;
      border-radius: 10px;
      color: var(--text-muted);
      cursor: pointer;
      display: grid;
      height: 36px;
      padding: 0;
      place-items: center;
      width: 36px;
    }

    .sub {
      color: var(--text-muted);
      font-size: var(--fs-small);
      line-height: var(--lh-small);
    }

    .sub--erro {
      color: var(--error-600);
    }

    .sub--valido {
      color: var(--green-700);
    }
  `,
})
export class TextField implements ControlValueAccessor {
  readonly label = input('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly placeholder = input('');
  readonly autocomplete = input<string>();
  readonly maxlength = input<number>();
  /** Texto de apoio neutro, mostrado quando nao ha mensagem de status. */
  readonly hint = input('');
  readonly status = input<FieldStatus>('idle');
  /** Substitui o hint quando o status e valido ou erro. */
  readonly message = input('');

  protected readonly id = `campo-texto-${++proximoId}`;
  protected readonly valor = signal('');
  protected readonly desabilitado = signal(false);
  protected readonly revelada = signal(false);

  protected readonly subtexto = computed(() =>
    this.status() !== 'idle' && this.message() ? this.message() : this.hint(),
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

  protected aoDigitar(evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.valor.set(valor);
    this.onChange(valor);
  }

  protected aoTocar(): void {
    this.onTouched();
  }
}
