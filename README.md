# DevExtreme Angular validator disposal repro

Minimal public reproduction for a DevExtreme Angular issue in `devextreme-angular@25.1.6`.

## Versions

- Angular: `19.2.20`
- DevExtreme: `25.1.6`
- DevExtreme Angular: `25.1.6`
- TypeScript: `5.7.3`

## Problem

A `dx-select-box` contains a nested `dx-validator`. When the validator itself is conditionally rendered with Angular `@if` and the condition changes from `true` to `false`, disposing the validator removes the editor host element from the DOM.

The demo contains two modes:

- **BUGGY**: `@if` controls the entire `<dx-validator>`.
- **FIXED**: `<dx-validator>` remains rendered and `@if` controls only the required rule.

## Reproduction

1. Start in **BUGGY** mode.
2. Open the form.
3. Ensure the **Requestor** tab has been rendered.
4. Click **State 10 → 20**.
5. Observe that the Requestor editor disappears and the DOM monitor reports that the `dx-select-box` was removed.
6. Switch to **FIXED** mode, reopen the form and repeat. The editor remains in the DOM.

## Run locally

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Netlify

The repository includes `netlify.toml` with the Angular build command and publish directory.

## Technical finding

`DxValidatorComponent` creates its widget on the parent editor element. During disposal, the inherited widget destruction path removes `this.instance.element()` from the DOM. For a nested validator, that element is the editor host (`<dx-select-box>`), so destroying only the validator also removes the editor's host node.

See `HANDOUT.md` for the full investigation and verification details.
