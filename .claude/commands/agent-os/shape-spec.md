# Shape Spec

Gather context and structure planning for significant work. **Run this command while in plan mode.**

## Important Guidelines

- **Always use AskUserQuestion tool** when asking the user anything
- **Offer suggestions** — Present options the user can confirm, adjust, or correct
- **Keep it lightweight** — This is shaping, not exhaustive documentation

## Prerequisites

This command **must be run in plan mode**.

**Before proceeding, check if you are currently in plan mode.**

If NOT in plan mode, **stop immediately** and tell the user:

```
Shape-spec must be run in plan mode. Please enter plan mode first, then run /shape-spec again.
```

Do not proceed with any steps below until confirmed to be in plan mode.

## Process

### Step 1: Clarify What We're Building

Use AskUserQuestion to understand the scope:

```
What are we building? Please describe the feature or change.

(Be as specific as you like — I'll ask follow-up questions if needed)
```

Based on their response, ask 1-2 clarifying questions if the scope is unclear. Examples:
- "Is this a new feature or a change to existing functionality?"
- "What's the expected outcome when this is done?"
- "Are there any constraints or requirements I should know about?"

### Step 2: Gather Visuals

Use AskUserQuestion:

```
Do you have any visuals to reference?

- Mockups or wireframes
- Screenshots of similar features
- Examples from other apps

(Paste images, share file paths, or say "none")
```

If visuals are provided, note them for inclusion in the spec folder.

### Step 3: Identify Reference Implementations

Use AskUserQuestion:

```
Is there similar code in this codebase I should reference?

Examples:
- "The comments feature is similar to what we're building"
- "Look at how src/features/notifications/ handles real-time updates"
- "No existing references"

(Point me to files, folders, or features to study)
```

If references are provided, read and analyze them to inform the plan.

### Step 4: Check Product Context

Check if `agent-os/product/` exists and contains files.

If it exists, read key files (like `mission.md`, `roadmap.md`, `tech-stack.md`) and use AskUserQuestion:

```
I found product context in agent-os/product/. Should this feature align with any specific product goals or constraints?

Key points from your product docs:
- [summarize relevant points]

(Confirm alignment or note any adjustments)
```

If no product folder exists, skip this step.

### Step 5: Surface Relevant Standards

Read `agent-os/standards/index.yml` to identify relevant standards based on the feature being built.

Use AskUserQuestion to confirm:

```
Based on what we're building, these standards may apply:

1. **api/response-format** — API response envelope structure
2. **api/error-handling** — Error codes and exception handling
3. **database/migrations** — Migration patterns

Should I include these in the spec? (yes / adjust: remove 3, add frontend/forms)
```

Read the confirmed standards files to include their content in the plan context.

### Step 6: Generate Spec Folder Name

Create a folder name using this format:
```
YYYY-MM-DD-HHMM-{feature-slug}/
```

Where:
- Date/time is current timestamp
- Feature slug is derived from the feature description (lowercase, hyphens, max 40 chars)

Example: `2026-01-15-1430-user-comment-system/`

**Note:** If `agent-os/specs/` doesn't exist, create it when saving the spec folder.

### Step 7: Structure the Plan

Now build the plan with **Task 1 always being "Save spec documentation"**. Each subsequent implementation task follows the **PM → Engineer → QA → PM pipeline**.

Present this structure to the user:

```
Here's the plan structure. Task 1 saves our shaping work. Each implementation task then runs through the full agent pipeline.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/{folder-name}/` with:

- **plan.md** — This full plan
- **shape.md** — Shaping notes (scope, decisions, context from our conversation)
- **standards.md** — Relevant standards that apply to this work
- **references.md** — Pointers to reference implementations studied
- **visuals/** — Any mockups or screenshots provided

## Task 2: [First implementation task]

**Pipeline:**
1. 🗂 PM — Find Linear ticket for this task; assign to `coren`; move to In Progress
2. 🔨 Engineer (nestjs-engineer / nextjs-engineer) — Implement the task per the ticket spec
3. ✅ QA — Verify every "Done when" criterion from the ticket against the actual code
4. 🗂 PM — Move ticket to Done

[Description of what gets built]

## Task 3: [Next task]

**Pipeline:** (same 4-step sequence)

[Description of what gets built]

...

---

Does this plan structure look right? I'll fill in the implementation tasks next.
```

### Step 8: Complete the Plan

After Task 1 is confirmed, continue building out the remaining implementation tasks based on:
- The feature scope from Step 1
- Patterns from reference implementations (Step 3)
- Constraints from standards (Step 5)

For each task include:
- Which engineer agent handles it: **nestjs-engineer** for BE tasks, **nextjs-engineer** for FE tasks
- The Linear ticket ID (e.g. GOO-5) if known, so PM can find it
- The specific "Done when" criteria so QA knows what to verify

Each task should be specific and actionable.

### Step 9: Ready for Execution

When the full plan is ready:

```
Plan complete. When you approve and execute:

1. Task 1 saves all spec documentation
2. Each implementation task runs through the pipeline:
   - PM assigns ticket to coren + moves to In Progress
   - Engineer implements
   - QA verifies done criteria
   - PM moves to Done

Ready to start? (approve / adjust)
```

## Output Structure

The spec folder will contain:

```
agent-os/specs/{YYYY-MM-DD-HHMM-feature-slug}/
├── plan.md           # The full plan
├── shape.md          # Shaping decisions and context
├── standards.md      # Which standards apply and key points
├── references.md     # Pointers to similar code
└── visuals/          # Mockups, screenshots (if any)
```

## shape.md Content

The shape.md file should capture:

```markdown
# {Feature Name} — Shaping Notes

## Scope

[What we're building, from Step 1]

## Decisions

- [Key decisions made during shaping]
- [Constraints or requirements noted]

## Context

- **Visuals:** [List of visuals provided, or "None"]
- **References:** [Code references studied]
- **Product alignment:** [Notes from product context, or "N/A"]

## Standards Applied

- api/response-format — [why it applies]
- api/error-handling — [why it applies]
```

## standards.md Content

Include the full content of each relevant standard:

```markdown
# Standards for {Feature Name}

The following standards apply to this work.

---

## api/response-format

[Full content of the standard file]

---

## api/error-handling

[Full content of the standard file]
```

## references.md Content

```markdown
# References for {Feature Name}

## Similar Implementations

### {Reference 1 name}

- **Location:** `src/features/comments/`
- **Relevance:** [Why this is relevant]
- **Key patterns:** [What to borrow from this]

### {Reference 2 name}

...
```

## Execution Pipeline

Every implementation task (Task 2+) runs through this 4-agent pipeline in order:

### 1. PM agent (start)
- Find the Linear ticket matching the task (by title or ID)
- Assign the ticket to `coren`
- Move ticket status → **In Progress**

### 2. Engineer agent (implement)
- **nestjs-engineer** for all BE tasks (NestJS modules, Prisma, DTOs, tests)
- **nextjs-engineer** for all FE tasks (pages, components, hooks, styles, tests)
- Implement everything specified in the ticket description
- Run lint + build + tests to confirm they pass

### 3. QA engineer agent (verify)
- Read the "Done when" criteria from the Linear ticket
- Inspect the actual code (no running servers needed — static analysis is fine)
- Check off each criterion that passes; report any that fail
- Do NOT move ticket status — that is PM's responsibility

### 4. PM agent (close)
- Review QA's report
- If all criteria pass → move ticket status → **Done**
- If criteria fail → leave In Progress and report blockers back

---

## Tips

- **Keep shaping fast** — Don't over-document. Capture enough to start, refine as you build.
- **Visuals are optional** — Not every feature needs mockups.
- **Standards guide, not dictate** — They inform the plan but aren't always mandatory.
- **Specs are discoverable** — Months later, someone can find this spec and understand what was built and why.
- **Pipeline is mandatory** — Every task must go through all 4 steps; never skip PM or QA.
