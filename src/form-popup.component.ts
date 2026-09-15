import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { DxPopupModule } from 'devextreme-angular';
import { ReproFormContentComponent } from './form-content.component';

export type FormState = 10 | 20;
export type ValidatorMode = 'buggy' | 'fixed';

@Component({
  selector: 'repro-form-popup',
  standalone: true,
  imports: [DxPopupModule, ReproFormContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dx-popup
      [dragEnabled]="false"
      [height]="560"
      [showCloseButton]="true"
      [title]="'Request form — state ' + state"
      [visible]="true"
      [width]="860"
      (onHidden)="closed.emit()"
    >
      <div class="popup-toolbar">
        <span class="state-label">
          Workflow state: {{ state }} —
          {{ state === 10 ? 'editable, Requestor required' : 'read-only, Requestor optional' }}
        </span>
        <button [disabled]="state !== 10" (click)="stateChanged.emit(20)">State 10 → 20</button>
        <button [disabled]="state !== 20" (click)="stateChanged.emit(10)">State 20 → 10</button>
      </div>
      <repro-form-content [mode]="mode" [state]="state" />
    </dx-popup>
  `,
})
export class ReproFormPopupComponent {
  @Input() public state: FormState = 10;
  @Input() public mode: ValidatorMode = 'buggy';
  public readonly closed = output<void>();
  public readonly stateChanged = output<FormState>();
}
