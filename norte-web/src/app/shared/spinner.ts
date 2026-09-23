import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'norte-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="carregando" role="status" aria-live="polite">
      <span class="giro" aria-hidden="true"></span>
      <span>{{ label() }}</span>
    </div>
  `,
  styles: `
    .carregando {
      align-items: center;
      color: var(--text-muted);
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      padding: var(--space-8);
    }

    .giro {
      animation: girar 0.9s linear infinite;
      border: 3px solid var(--border-default);
      border-radius: 50%;
      border-top-color: var(--action-primary);
      display: inline-block;
      height: 22px;
      width: 22px;
    }

    @keyframes girar {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Spinner {
  readonly label = input('Carregando...');
}
