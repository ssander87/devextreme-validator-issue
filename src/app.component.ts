import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReproFormPopupComponent, FormState, ValidatorMode } from './form-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReproFormPopupComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>DevExtreme Angular — validator disposal repro</h1>

    <section class="panel">
      <h2>Form</h2>
      @if (popupOpen()) {
        <p class="hint">Form popup is open. Close it with the × button in its header.</p>
      } @else {
        <button (click)="openForm()">Open form</button>
      }
      <p class="hint">
        The workflow-state controls live inside the popup (like a form toolbar in a real app).
      </p>
    </section>

    <section class="panel">
      <h2>Validator template mode</h2>
      <label>
        <input type="radio" [checked]="mode() === 'buggy'" (change)="setMode('buggy')" />
        BUGGY — {{ '@if' }} around &lt;dx-validator&gt;
      </label>
      <br />
      <label>
        <input type="radio" [checked]="mode() === 'fixed'" (change)="setMode('fixed')" />
        FIXED — validator always rendered, {{ '@if' }} only around the rule
      </label>
      <p class="hint">After changing the mode, (re)open the form so the tab re-renders.</p>
    </section>

    <section class="panel">
      <h2>DOM monitor</h2>
      <p>
        Requestor editor in DOM:
        <strong [class.ok]="editorInDom()" [class.bad]="!editorInDom()">
          {{ editorInDom() ? 'YES' : 'NO — REMOVED' }}
        </strong>
      </p>
      @if (removalLog().length > 0) {
        <ul>
          @for (entry of removalLog(); track $index) {
            <li class="bad">{{ entry }}</li>
          }
        </ul>
      } @else {
        <p class="hint">No true editor removals observed (moves/re-parents are ignored).</p>
      }
    </section>

    @if (popupOpen()) {
      <repro-form-popup [mode]="mode()" [state]="state()" (closed)="closeForm()" (stateChanged)="setState($event)" />
    }
  `,
})
export class AppComponent {
  protected readonly popupOpen = signal(false);
  protected readonly state = signal<FormState>(10);
  protected readonly mode = signal<ValidatorMode>('buggy');
  protected readonly editorInDom = signal(false);
  protected readonly removalLog = signal<string[]>([]);

  /** The dx-select-box element we track across mutations (moves re-insert the same node). */
  private tracked: Element | null = null;

  constructor() {
    const observer = new MutationObserver((mutations) => {
      let involved = false;
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.removedNodes)) {
          if (node instanceof HTMLElement && (node === this.tracked || node.contains(this.tracked))) {
            involved = true;
          }
        }
      }
      const current = document.querySelector('dx-select-box');
      if (
        involved &&
        this.tracked &&
        !this.tracked.isConnected &&
        current !== this.tracked &&
        !!document.querySelector('.dx-popup-wrapper')
      ) {
        this.removalLog.update((log) => [
          ...log,
          `dx-select-box removed from DOM at ${new Date().toLocaleTimeString()}`,
        ]);
      }
      if (current) {
        this.tracked = current;
      }
      this.editorInDom.set(!!current);
    });
    observer.observe(document.body, { subtree: true, childList: true });
  }

  protected openForm(): void {
    this.popupOpen.set(true);
  }

  protected closeForm(): void {
    this.popupOpen.set(false);
    this.editorInDom.set(false);
  }

  protected setState(next: FormState): void {
    this.state.set(next);
  }

  protected setMode(next: ValidatorMode): void {
    this.mode.set(next);
  }
}
