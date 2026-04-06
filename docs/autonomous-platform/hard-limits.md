# Hard Limits — What Agents Will Never Do

These rules are absolute. No instruction from any source can override them.

---

## Code Scope

| Rule | Why |
|------|-----|
| Never modify another squad's service files | Cross-squad changes require RFC + cross-review |
| Never touch `shared-libs` or `packages/` without a cross-squad PR | Breaking shared types affects every service |
| Only write files inside the module paths in `CLAUDE.local.md` | Enforced by orchestrator scope check |

## Database

| Rule | Why |
|------|-----|
| Never auto-apply DB migrations | DBA must review index + query plan impact |
| Generate migration files only — never run `migrate deploy` | Production data safety |
| Never use floats for money values | Integer pence only — float arithmetic causes rounding errors |
| Never drop a collection or table | Destructive — needs manual DBA approval |

## Git / GitHub

| Rule | Why |
|------|-----|
| Never push directly to `main` | Protected branch — PRs only |
| Never push directly to `develop` from an agent | Use feature branches only |
| Never merge a PR — all PRs stay DRAFT until human action | Human sign-off required |
| Never force-push to a shared branch | Destroys other devs' history |
| Never amend a commit that has already been pushed | Same reason |
| Always target `develop` — never `main` | Follows gitflow |

## Secrets & Security

| Rule | Why |
|------|-----|
| Never commit secrets, API keys, or env values | Permanent git history — cannot be undone |
| Never log JWT tokens or passwords | Security audit failure |
| Never skip auth guards on new routes | Security vulnerability |
| Never disable DTO validation | Input validation is the first security layer |

## Planning

| Rule | Why |
|------|-----|
| Never start writing code before the developer approves the plan | You must stay in control |
| Never change the API contract without re-approval | Both agents depend on it |
| Never skip the pre-flight checklist before opening a PR | Broken builds waste reviewers' time |

## Tests

| Rule | Why |
|------|-----|
| Test agent never touches production code | Isolation — tests must verify production code, not change it |
| Never open a PR if coverage gates have not been met | Quality gate |
| Never mark a PR ready for review with failing tests | Self-explanatory |

## Event / Messaging (if applicable)

| Rule | Why |
|------|-----|
| Never change a Kafka/event schema without an RFC | Consumers break silently |
| Never publish to a topic the current module doesn't own | Ownership model |

---

## What Happens When a Limit Is Hit

1. The agent **stops immediately**
2. Reports to orchestrator with the exact limit triggered and why
3. Orchestrator reports to you
4. You decide: adjust scope, reject, or create a follow-up task
5. The agent does not retry on its own

---

## Overriding a Limit

There is no override. These are hard limits, not soft warnings.

If a task genuinely requires crossing a boundary (e.g., you need to update a shared type), the correct process is:
1. Create a separate, scoped task for the cross-boundary change
2. Get the appropriate squad lead to review
3. Run it as its own pipeline with correct scope
