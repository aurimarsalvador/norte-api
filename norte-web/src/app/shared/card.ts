import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'norte-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cartao">
      @if (title()) {
        <header>
          <h2>{{ title() }}</h2>
          @if (subtitle()) {
            <p class="texto-suave">{{ subtitle() }}</p>
          }
        </header>
      }
      <ng-content />
    </section>
  `,
  styles: `
    header h2 {
      margin-bottom: 4px;
    }

    header p {
      margin-bottom: calc(var(--espaco) * 2);
    }
  `,
})
export class Card {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
