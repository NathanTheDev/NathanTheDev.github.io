# Working in this repo

## Codebase map

Before exploring this codebase (finding where something lives, understanding
how a feature works, deciding where a change belongs), read
`tmp/CODEBASE_OVERVIEW.md` first. It's a maintained map of the directory
structure, the major subsystems (the distortion-shader effect, the cube
motif, scroll snapping, the trace-line seam chain), their gotchas, and known
dead code — reading it first avoids re-deriving context that's already
written down, and flags fragile areas (like the trace-line handoff
coordinates) before you accidentally break them.

`tmp/` is gitignored — this file is local scratch space, not shipped
project documentation, so don't hold it to the same polish bar as the rest
of the repo.

**Keep it current.** Whenever you make a change that would make the
overview inaccurate or incomplete — new files, moved/renamed/deleted files,
a new subsystem or convention, a changed data flow, a fixed piece of "known
dead code", a new gotcha worth flagging for next time — update
`tmp/CODEBASE_OVERVIEW.md` in the same turn as the code change, not as a
follow-up. If the file doesn't exist for some reason, recreate it by
reviewing the codebase rather than skipping this step.
