# Workflow Guide — Step by Step

## Before Your First Run

### Step 1 — Fill in CLAUDE.local.md
```markdown
Developer: Owais Ahmed
Squad:     Platform
Role:      fullstack

frontend_modules:
  - apps/web/src/app/marketplace/
  - apps/web/src/components/ModelCard.tsx

backend_modules:
  - apps/api/src/models/
```

> This file should be in `.gitignore`. It is personal — never commit it.

### Step 2 — Update current-task.md
```markdown
id: NXS-421
title: Add model recommendation filter by budget
type: feature

fe_ticket: NXS-421
be_ticket: NXS-422
```

### Step 3 — Verify CLAUDE.md is up to date
The orchestrator reads team rules from `CLAUDE.md`. If your team has new rules, update that file first.

---

## Running the Pipeline

### Trigger
```
/automate NXS-421 NXS-422
```
Or with a single ticket:
```
/automate NXS-421
```

### What happens immediately
1. Orchestrator reads all 4 context files
2. Orchestrator defines (or validates) the API contract
3. Orchestrator builds the subtask graph
4. **Orchestrator shows you the full plan and stops**

### Plan review (your job)
Read the plan carefully:
- Is the API contract shape correct?
- Are the files listed correct (no out-of-scope paths)?
- Is the parallel/sequential order right?

Respond with:
- `proceed` → start execution
- `change X to Y` → orchestrator updates plan, shows again
- `reject` → cancel, no code written

---

## Parallel Execution (Layer 3)

Once you say `proceed`, the orchestrator spawns two agents simultaneously:

```
Terminal 1 (FE Agent)          Terminal 2 (BE Agent)
─────────────────────          ─────────────────────
Reads api-contract.md          Reads api-contract.md
Creates TypeScript types        Creates DTO (matches contract)
Builds React Query hook         Creates Controller (HTTP only)
Builds component (3 states)     Creates Service (business logic)
Adds MSW mock                   Creates Repository (DB only)
Writes unit tests               Writes unit test stubs
tsc ✓ lint ✓ tests ✓ build ✓   tsc ✓ lint ✓ tests ✓ build ✓
Sends done signal               Sends done signal
```

### Contract mismatch protocol
If either agent finds that what they need to build doesn't match `api-contract.md`:

1. That agent **stops immediately** and reports the mismatch
2. The other agent also **stops immediately**
3. You update `api-contract.md` with the correct shape
4. You re-approve
5. Both agents resume

---

## Test Phase (Layer 4)

When both done signals arrive, orchestrator spawns the test agent.

The test agent:
1. Reads both repos (read-only for production code)
2. Writes/updates test files only
3. Runs all 4 test layers
4. Reports coverage vs gates
5. If gates pass → signals orchestrator
6. If any test fails → files a bug report and routes to correct agent

### Coverage gates that must pass

| What               | Minimum |
|--------------------|---------|
| BE Service methods | 90%     |
| BE Controllers     | 80%     |
| FE Components      | 70%     |
| Utility functions  | 95%     |

---

## PR Phase (Layer 5)

When test agent signals all-green, orchestrator spawns the GitHub agent.

The GitHub agent:
1. Runs pre-flight (tsc, lint, test, build, rebase)
2. Scans for secrets / missing auth guards / `any` types
3. Opens FE PR as DRAFT on `develop`
4. Opens BE PR as DRAFT on `develop`
5. Cross-links both PRs
6. Updates Jira tickets to `In Review`

---

## What You Do After the Pipeline

1. Pull both branches locally and review the diff
2. Share `migration.sql` (if present) with your DBA — do NOT apply it yourself
3. Mark both PRs → **Ready for Review** when you're satisfied
4. Coordinate 2 reviewers: squad lead + platform reviewer
5. After approvals, a human merges — never the agent

---

## Fixing Bugs the Pipeline Finds

If the test agent files a bug report:

```
=== BUG REPORT ===
Severity:  blocking
Repo:      backend
File:      apps/api/src/models/models.service.ts
Line:      47
Expected:  returns [] when no models match filter
Actual:    throws TypeError: Cannot read property 'map' of undefined
Route to:  BE Agent
```

The orchestrator automatically routes this to the correct agent. That agent fixes the code, then the test agent re-runs automatically. You don't need to do anything — just watch.

If severity is `non-blocking`, orchestrator will ask you: fix now or create a follow-up ticket?
