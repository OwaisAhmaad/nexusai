# current-task.md — Active Ticket Context
> Orchestrator reads this at the start of every /automate run.
> Update this file when switching tickets.

## Ticket
```
id:          NXS-000
title:       [Short feature description]
type:        feature | bug | refactor | chore
priority:    P0 | P1 | P2
reporter:    [name]
assignee:    [your name]
```

## Description
[Copy the full ticket description here]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Linked Tickets
```
fe_ticket:   NXS-000   # frontend work
be_ticket:   NXS-001   # backend work
blocks:      []
blocked_by:  []
```

## API Contract File
```
contract: .claude/api-contract.md
status:   draft | approved | locked
```

## Scope
```
# Files the agents are allowed to touch for this ticket
fe:
  - apps/web/src/app/[feature]/
  - apps/web/src/components/[Component].tsx

be:
  - apps/api/src/[module]/
```

## Definition of Done
- [ ] FE: tsc ✓ lint ✓ tests ✓ build ✓
- [ ] BE: tsc ✓ lint ✓ tests ✓ build ✓
- [ ] Coverage gates met (see `.claude/agents/test-agent.md`)
- [ ] Both PRs opened as DRAFT on `develop`
- [ ] Jira ticket moved to `In Review`

---
> Orchestrator will NOT start coding until you approve the plan.
> Run `/automate NXS-000 NXS-001` to trigger the full pipeline.
