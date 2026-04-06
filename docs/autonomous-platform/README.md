# Autonomous Full-Stack Dev Platform

> Claude Code · NexusAI · Next.js 14 + NestJS 10
>
> One command → plan approval → parallel FE + BE → tests → DRAFT PRs

---

## What This Is

A multi-agent development pipeline that automates the entire journey from Jira ticket to DRAFT pull request. You stay in control at every gate — agents do the mechanical work, you make the decisions.

```
You: /automate NXS-421 NXS-422
     ↓
Orchestrator plans everything → shows you → waits for approval
     ↓ (you say "proceed")
FE Agent ─┬─ parallel execution ─┬─ BE Agent
           ↓                      ↓
     done signal             done signal
           └──────────┬───────────┘
                      ↓
               Test Agent runs
                      ↓
           all green → GitHub Agent
                      ↓
            2 DRAFT PRs opened
                      ↓
              Back to you for review
```

---

## The 7 Layers

| Layer | Component | Purpose |
|-------|-----------|---------|
| 0 | You | Trigger via `/automate`, approve plan, review PRs |
| 1 | Orchestrator | Reads context files, plans, coordinates all agents |
| 2 | API Contract | Source of truth shared between FE and BE agents |
| 3 | FE + BE Agents | Execute in parallel, each in their own module scope |
| 4 | Test Agent | Writes and runs all tests, enforces coverage gates |
| 5 | GitHub Agent | Pre-flight checks + opens DRAFT PRs, never merges |
| 6 | Shared Context | MCP connectors + filesystem available to all agents |
| 7 | Final Output | DRAFT PRs + test report + migration SQL + Jira updated |

---

## File Structure

```
nexusai/
├── CLAUDE.md                        # Team-wide rules (committed)
├── CLAUDE.local.md                  # Your personal scope (NEVER commit)
│
├── .claude/
│   ├── current-task.md             # Active ticket — update per task
│   ├── api-contract.md             # FE/BE contract — update per feature
│   │
│   └── agents/
│       ├── orchestrator.md         # Layer 1 — master coordinator
│       ├── frontend-dev.md         # Layer 3 — FE agent
│       ├── backend-dev.md          # Layer 3 — BE agent
│       ├── test-agent.md           # Layer 4 — testing only
│       ├── github-agent.md         # Layer 5 — PRs only
│       ├── code-reviewer.md        # On-demand code review
│       ├── db-manager.md           # On-demand DB operations
│       └── api-tester.md           # On-demand API health checks
│
└── docs/autonomous-platform/
    ├── README.md                   # This file
    ├── workflow.md                 # Step-by-step usage guide
    ├── hard-limits.md              # What agents will never do
    └── coverage-gates.md          # Test coverage requirements
```

---

## How to Use

### 1. Set up your scope (once)
Edit `CLAUDE.local.md` with your name and the modules you own.

### 2. Load the ticket
Update `.claude/current-task.md` with the ticket details.

### 3. Run the pipeline
```bash
/automate NXS-421 NXS-422
```

### 4. Approve the plan
Orchestrator will show a plan and wait. Read it. Adjust if needed. Type `proceed`.

### 5. Let agents work
FE and BE agents run in parallel. Watch the progress.

### 6. Review the output
- Two DRAFT PRs on `develop`
- Test coverage report
- `migration.sql` if DB changed (give to DBA — do NOT apply yourself)
- Jira tickets moved to `In Review`

### 7. When ready
Mark both PRs → **Ready for Review**. Needs 2 approvals before merge.

---

## Key Rules

- Orchestrator never starts coding without your approval
- Agents only touch files in their assigned module
- All PRs target `develop` — never `main`
- DB migrations are generated only, never auto-applied
- No agent ever merges a PR

See [`hard-limits.md`](./hard-limits.md) for the full list.
