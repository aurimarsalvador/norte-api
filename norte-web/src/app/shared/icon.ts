import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'check'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-down'
  | 'eye'
  | 'eye-off'
  | 'circle-alert'
  | 'loader'
  | 'compass'
  | 'dot';

/** Tracos copiados do Lucide (grade 24px, traco 2px, pontas arredondadas). */
const PATHS: Partial<Record<IconName, string[]>> = {
  check: ['M20 6 9 17l-5-5'],
  'arrow-left': ['m12 19-7-7 7-7', 'M19 12H5'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'chevron-down': ['m6 9 6 6 6-6'],
  eye: [
    'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
  ],
  'eye-off': [
    'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49',
    'M14.084 14.158a3 3 0 0 1-4.242-4.242',
    'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
    'm2 2 20 20',
  ],
  'circle-alert': ['M12 8v4', 'M12 16h.01'],
  loader: ['M21 12a9 9 0 1 1-6.219-8.56'],
  compass: [
    'm16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z',
  ],
};

const CIRCLES: Partial<Record<IconName, [number, number, number][]>> = {
  eye: [[12, 12, 3]],
  'circle-alert': [[12, 12, 10]],
  compass: [[12, 12, 10]],
  dot: [[12, 12, 4]],
};

/** Icone de traco. Decorativo por padrao: quem precisa de nome acessivel o coloca no botao. */
@Component({
  selector: 'norte-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      [attr.stroke]="color()"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (c of circles(); track $index) {
        <circle
          [attr.cx]="c[0]"
          [attr.cy]="c[1]"
          [attr.r]="c[2]"
          [attr.fill]="name() === 'dot' ? color() : 'none'"
          [attr.stroke]="name() === 'dot' ? 'none' : color()"
        />
      }
      @for (d of paths(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }

    svg {
      display: block;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly strokeWidth = input(2);
  readonly color = input('currentColor');

  protected readonly paths = computed(() => PATHS[this.name()] ?? []);
  protected readonly circles = computed(() => CIRCLES[this.name()] ?? []);
}
