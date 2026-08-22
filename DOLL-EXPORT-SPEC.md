# Doll export spec — for dollzrevival → the site

The site composites your dollz by **cross-fading full-body PNGs** (one per persona).
Because dollzrevival keeps the same base/pose, this registers perfectly with almost
no work — you just export the same doll wearing different things.

## What to make (5 exports)

Build Molly **once** on the female base, then change only the outfit/accessory for each.

| File name        | Look                                                                 |
|------------------|----------------------------------------------------------------------|
| `molly.png`      | Default: **black button-down, jeans, sneakers**, pigtails, her hair  |
| `producer.png`   | Same + a "producer" cue (headset / clipboard / lanyard)              |
| `writer.png`     | Same + a writer cue (glasses / notebook / coffee)                   |
| `maker.png`      | Same + a maker cue (apron / scissors / tote of supplies)            |
| `popculture.png` | Same + a pop-culture cue (sunglasses / statement tee)              |

## The 3 rules that make it work

1. **Don't move the doll between exports.** Same base, same pose, same on-screen
   position every time. (Change clothes, not the pose.)
2. **Same canvas size** for all 5 exports (whatever dollzrevival's default is — just
   keep it identical). Same width × height, every file.
3. **Background:** transparent PNG is ideal. If the maker only exports on the lavender
   background, that's fine too — send it as-is and I'll key the lavender out, or match
   the frame to it. Either works.

## Handing them over

Drop the 5 PNGs in an `img/` folder next to `index.html`. Then I flip on one line per
persona in the `PERSONAS` config (`img:"img/producer.png"`, etc.) and the placeholder
SVG doll is replaced by the real one, cross-fading on every persona click.

## Optional (richer): the draggable "closet"

If you also want the drag-a-piece-onto-Molly interaction from the proof-of-concept,
I need a few **accessory-only** cut-outs on transparent backgrounds (just the headset,
just the book, etc.). Easiest path: export a version wearing *only* that accessory and
I'll isolate it — or you send the accessory art separately. This is a nice-to-have on
top of the persona cross-fade, not required.
