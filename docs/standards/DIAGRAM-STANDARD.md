# Diagram standard

Architecture diagrams are a Platform Signal brand asset. They explain one question. They omit everything else on purpose.

## File layout

```text
content/articles/<slug>/diagrams/
  PS-D-NNNN.mmd
  PS-D-NNNN.svg
  PS-D-NNNN.yml
```

Commit the SVG. Mermaid is the editable source, not a runtime dependency. Hobby builds stay simple.

Metadata (`PS-D-NNNN.yml`) requires: id, title, article_id, type, dates, source_format, license, alt_text, question. Omissions are encouraged.

## Visual language

Theme-safe SVG only. Do not ship a second light/dark file.

| Class | Use |
|---|---|
| `.node` | Boxes. `currentColor` stroke, ~4% fill |
| `.node-focus` | The box the diagram is arguing |
| `.band` | Dashed grouping, not a second argument |
| `.connector` | Orthogonal or short straight edges, with a marker |
| `.label` / `.label-focus` | 13px IBM Plex via CSS |
| `.sublabel` / `.edge-label` | 11px, muted via fill-opacity |

Rules:

- One accent, used on the focus node only
- Rounded rects (`rx="6"`)
- Color-blind safe: meaning is position, label, and a single accent, not a rainbow
- No gradients, drop shadows, vendor logos, or robot art
- Test the article in light and dark before merging
- Unique `marker` ids per diagram (`d1-arrow`, `d6-arrow`) so two figures on one page cannot collide

## Caption and figure chrome

Captions name the ID and state the claim. No em dashes.

The figure component offers **Expand** (full-viewport dialog) and **Download SVG**. Copy Mermaid waits until a later phase.

## Question test

Every diagram answers one question in `PS-D-NNNN.yml`. If a reader cannot say what the accent box is arguing, the drawing is decoration. Redraw it.
