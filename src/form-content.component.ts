import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DxFormModule, DxSelectBoxModule, DxTabPanelModule, DxTextBoxModule } from 'devextreme-angular';
import { DxValidatorComponent } from 'devextreme-angular';
import { DxiValidatorRequiredRuleComponent } from 'devextreme-angular/ui/validator/nested';
import { FormState, ValidatorMode } from './form-popup.component';

@Component({
  selector: 'repro-form-content',
  standalone: true,
  imports: [
    DxFormModule,
    DxTabPanelModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxValidatorComponent,
    DxiValidatorRequiredRuleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dx-form [formData]="formData" class="repro-form" validationGroup="reproFormGroup">
      <dxi-item itemType="group">
        <dxi-item itemType="tabbed" name="tabPanel">
          <dxo-tab-panel-options [deferRendering]="true"></dxo-tab-panel-options>

          <dxi-tab title="Requestor">
            <div *dxTemplate>
              <div class="field">
                <dx-select-box
                  [dataSource]="units"
                  [displayExpr]="'name'"
                  [label]="'Requestor' + (state === 10 ? ' *' : '')"
                  [labelMode]="'outside'"
                  [readOnly]="state === 20"
                  [valueExpr]="'id'"
                  [value]="'Unit A'"
                >
                  @if (mode === 'buggy') {
                    @if (state === 10) {
                      <dx-validator [validationGroup]="'reproFormGroup'">
                        <dxi-validator-required-rule message="A requestor must be selected." />
                      </dx-validator>
                    }
                  } @else {
                    <!-- Workaround: validator stays in the DOM, only the rule is toggled. -->
                    <dx-validator [validationGroup]="'reproFormGroup'">
                      @if (state === 10) {
                        <dxi-validator-required-rule message="A requestor must be selected." />
                      }
                    </dx-validator>
                  }
                </dx-select-box>
              </div>
            </div>
          </dxi-tab>

          <dxi-tab title="Other">
            <div *dxTemplate>
              <div class="field">
                <dx-text-box [label]="'Note'" [labelMode]="'outside'" [value]="'control field'"></dx-text-box>
              </div>
            </div>
          </dxi-tab>
        </dxi-item>
      </dxi-item>
    </dx-form>
  `,
})
export class ReproFormContentComponent {
  @Input() public state: FormState = 10;
  @Input() public mode: ValidatorMode = 'buggy';

  protected readonly units = [
    { id: 'Unit A', name: 'Unit A' },
    { id: 'Unit B', name: 'Unit B' },
    { id: 'Unit C', name: 'Unit C' },
  ];
  protected readonly formData: Record<string, unknown> = {};
}
