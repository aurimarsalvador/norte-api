import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'check'
  | 'x'
  | 'arrow-left'
  | 'arrow-right'
  | 'chevron-down'
  | 'chevron-right'
  | 'eye'
  | 'eye-off'
  | 'circle-alert'
  | 'info'
  | 'loader'
  | 'compass'
  | 'heart'
  | 'lightbulb'
  | 'briefcase'
  | 'map-pin'
  | 'graduation-cap'
  | 'clock'
  | 'user'
  | 'map'
  | 'flask-conical'
  | 'list-checks'
  | 'rotate-ccw'
  | 'laugh'
  | 'smile'
  | 'meh'
  | 'frown'
  | 'log-out'
  | 'dot';

/** Tracos copiados do Lucide (grade 24px, traco 2px, pontas arredondadas). */
const PATHS: Partial<Record<IconName, string[]>> = {
  check: ['M20 6 9 17l-5-5'],
  x: ['M18 6 6 18', 'm6 6 12 12'],
  'arrow-left': ['m12 19-7-7 7-7', 'M19 12H5'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
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
  info: ['M12 16v-4', 'M12 8h.01'],
  loader: ['M21 12a9 9 0 1 1-6.219-8.56'],
  compass: [
    'm16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z',
  ],
  heart: [
    'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
  ],
  lightbulb: [
    'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
    'M9 18h6',
    'M10 22h4',
  ],
  briefcase: ['M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'],
  'map-pin': [
    'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
  ],
  'graduation-cap': [
    'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z',
    'M22 10v6',
    'M6 12.5V16a6 3 0 0 0 12 0v-3.5',
  ],
  clock: ['M12 6v6l4 2'],
  user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
  map: [
    'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
    'M15 5.764v15',
    'M9 3.236v15',
  ],
  'flask-conical': [
    'M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2',
    'M8.5 2h7',
    'M7 16h10',
  ],
  'list-checks': ['m3 17 2 2 4-4', 'm3 7 2 2 4-4', 'M13 6h8', 'M13 12h8', 'M13 18h8'],
  'rotate-ccw': ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
  laugh: ['M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z', 'M9 9h.01', 'M15 9h.01'],
  smile: ['M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],
  meh: ['M8 15h8', 'M9 9h.01', 'M15 9h.01'],
  frown: ['M16 16s-1.5-2-4-2-4 2-4 2', 'M9 9h.01', 'M15 9h.01'],
  'log-out': ['m16 17 5-5-5-5', 'M21 12H9', 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'],
};

const CIRCLES: Partial<Record<IconName, [number, number, number][]>> = {
  eye: [[12, 12, 3]],
  'circle-alert': [[12, 12, 10]],
  info: [[12, 12, 10]],
  compass: [[12, 12, 10]],
  clock: [[12, 12, 10]],
  user: [[12, 7, 4]],
  'map-pin': [[12, 10, 3]],
  laugh: [[12, 12, 10]],
  smile: [[12, 12, 10]],
  meh: [[12, 12, 10]],
  frown: [[12, 12, 10]],
  dot: [[12, 12, 4]],
};

/** [x, y, largura, altura, raio] */
const RECTS: Partial<Record<IconName, [number, number, number, number, number][]>> = {
  briefcase: [[2, 6, 20, 14, 2]],
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
      [attr.fill]="fill()"
      [attr.stroke]="color()"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @for (r of rects(); track $index) {
        <rect [attr.x]="r[0]" [attr.y]="r[1]" [attr.width]="r[2]" [attr.height]="r[3]" [attr.rx]="r[4]" fill="none" />
      }
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
  /** So o coracao do favorito usa preenchimento; o resto do conjunto e so traco. */
  readonly fill = input('none');

  protected readonly paths = computed(() => PATHS[this.name()] ?? []);
  protected readonly circles = computed(() => CIRCLES[this.name()] ?? []);
  protected readonly rects = computed(() => RECTS[this.name()] ?? []);
}
