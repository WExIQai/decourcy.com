<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:wexiqai-environment-setup -->
# WExIQai cross-project environment setup

When provisioning a Claude Code on the web environment that needs to work across WExIQai projects (not just `decourcy.com`), configure the GitHub MCP scope to the **entire `WExIQai` org**, not a single repo.

Per-repo scoping causes `mcp__github__*` calls for sibling repos to fail with:
`Access denied: repository "wexiqai/<name>" is not configured for this session.`

Cross-org code search (`search_code org:WExIQai ...`) also returns 0 results when the session is single-repo scoped, even though it should succeed at the org level — so discovery of shared routines, hooks, or slash commands across sibling repos is impossible until scope is expanded.

Required settings for cross-project sessions:
- GitHub MCP scope: `WExIQai/*` (org-wide)
- GitHub identity: `wexiq-ai` (Team account, post-transition)
- Branch convention: feature work on `claude/<short-slug>` branches; push with `-u origin <branch>`

Canonical routines (hooks, slash commands, agents) live in each repo's own `.claude/` directory. Each WExIQai repo is self-contained: none of them point at any other as canon. Cross-trio development plumbing (the macOS LaunchAgent that keeps local clones fresh, plus the cross-trio session-kickoff explainer) lives in `WExIQai/dev-infra`.
<!-- END:wexiqai-environment-setup -->
