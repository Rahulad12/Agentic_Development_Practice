# Agent Knowledge Guide

How to use the organized documentation structure to efficiently handle requests with minimal token usage.

---

## 🎯 Purpose

This guide shows agents (AI assistants) and developers how to leverage the organized documentation to:
- ✅ Answer questions quickly without re-reading all docs
- ✅ Find relevant information in seconds
- ✅ Save tokens by referencing docs instead of explaining
- ✅ Maintain consistency across the project
- ✅ Enable smooth transitions between conversation sessions

---

## 📂 Documentation Organization

### Entry Points

| Location | Purpose | Use When |
|----------|---------|----------|
| `README.md` | Quick overview | Someone just joined or needs orientation |
| `CLAUDE.md` | Master guide | Need full project context |
| `docs/README.md` | Documentation index | Looking for specific guides |

### By Topic

#### Frontend Development
```
frontend/DOCS.md                          ← Quick reference (5 min)
├── frontend/REACT_19_RUNTIME_ENV_SETUP.md    ← React 19 detailed (20 min)
└── frontend/REACT_QUERY_INTEGRATION.md        ← Data fetching (15 min)
```

**Use when:**
- Building React components
- Setting up data fetching
- Configuring environment variables
- Understanding React 19 patterns

#### Backend Development
```
backend/DOCS.md                           ← Quick reference (5 min)
├── backend/BACKEND_SETUP.md                   ← Complete guide (30 min)
├── backend/BACKEND_COMPLETE.md                ← Summary (10 min)
└── backend/BUILD_NOTES.md                     ← Troubleshooting (5 min)
```

**Use when:**
- Creating new entities/services
- Configuring database
- Building API endpoints
- Troubleshooting build issues

#### Full-Stack Integration
```
docs/INTEGRATION_GUIDE.md                 ← Frontend ↔ Backend (15 min)
```

**Use when:**
- Testing API calls from frontend
- Creating end-to-end features
- Debugging network requests

#### Architecture & Conventions
```
docs/architecture.md                      ← System design
CLAUDE.md                                 ← Code conventions
docs/DECISIONS.md                         ← Architectural decisions
knowledge/wiki/frontend.md                ← React patterns
knowledge/wiki/backend.md                 ← .NET patterns
knowledge/wiki/conventions.md             ← Code style
```

**Use when:**
- Reviewing system design
- Following code style
- Understanding architectural decisions
- Learning project conventions

---

## 🤖 For Agents & Assistants

### How to Use This for Token Efficiency

#### 1. **First Session - New Project**

Instead of asking "What's in this project?" and getting a long explanation:

**Do this:**
```
User: "Tell me about this project"
Agent: 
  1. Read: /README.md (2 min)
  2. Read: /docs/README.md (2 min)
  3. Say: "I found the project guide. Here's what I understand..."
  4. Ask clarifying questions
```

**Result:** Uses less tokens than explaining everything from scratch

#### 2. **When Someone Asks About React**

Instead of re-explaining React patterns:

**Do this:**
```
User: "How do I create a React hook?"
Agent:
  1. Check: /frontend/DOCS.md
  2. Recommend: "See frontend/DOCS.md -> Common Tasks"
  3. Or directly quote relevant section
  4. Provide context-specific example
```

**Result:** Reference docs + minimal explanation = fewer tokens

#### 3. **When Someone Wants to Build a Feature**

Instead of creating all instructions from scratch:

**Do this:**
```
User: "How do I add a new API endpoint?"
Agent:
  1. Check: /backend/DOCS.md -> "Common Tasks"
  2. Follow: /backend/BACKEND_SETUP.md -> "Add New Entity" section
  3. Provide step-by-step with copy-paste code
  4. Point to: /docs/INTEGRATION_GUIDE.md for testing
```

**Result:** Consistent guidance based on documented patterns

#### 4. **When Debugging**

Instead of extensive troubleshooting conversation:

**Do this:**
```
User: "Getting CORS error"
Agent:
  1. Check: /backend/BUILD_NOTES.md -> "Troubleshooting"
  2. Check: /docs/INTEGRATION_GUIDE.md -> "Common Issues"
  3. Run verification steps
  4. Link to: /CLAUDE.md for CORS config reference
```

**Result:** Quick resolution using documented solutions

#### 5. **Between Sessions - Context Transfer**

Instead of explaining everything again:

**Do this:**
```
Session 2:
Agent: "I see we have extensive docs organized by topic.
  Let me check the memory system and relevant guides..."
  
  1. Read: /backend/DOCS.md (previous focus)
  2. Check memory: backend_architecture.md
  3. Understand: what was built before
  4. Continue: from where you left off
```

**Result:** Smooth continuation without re-explanation

---

## 📖 Quick Reference by Question

### "How do I...?"

| Question | Answer File | Read Time |
|----------|------------|-----------|
| Set up React 19? | `frontend/REACT_19_RUNTIME_ENV_SETUP.md` | 20 min |
| Use React Query? | `frontend/REACT_QUERY_INTEGRATION.md` | 15 min |
| Set up backend? | `backend/BACKEND_SETUP.md` | 30 min |
| Add new entity? | `backend/BACKEND_SETUP.md` → "Add New Entity" | 5 min |
| Create API hook? | `frontend/REACT_QUERY_INTEGRATION.md` → "Product Hooks" | 5 min |
| Test integration? | `docs/INTEGRATION_GUIDE.md` | 15 min |
| Fix build error? | `backend/BUILD_NOTES.md` → "Common Build Issues" | 5 min |
| Understand architecture? | `docs/architecture.md` | 10 min |
| Learn conventions? | `CLAUDE.md` | 15 min |

### "Where is...?"

| Item | Location |
|------|----------|
| Frontend quick ref | `frontend/DOCS.md` |
| Backend quick ref | `backend/DOCS.md` |
| API endpoints | `backend/BACKEND_SETUP.md` → "API Endpoints" |
| React patterns | `knowledge/wiki/frontend.md` |
| .NET patterns | `knowledge/wiki/backend.md` |
| Code style | `knowledge/wiki/conventions.md` |
| Architecture decisions | `docs/DECISIONS.md` |
| Runtime config | `frontend/REACT_19_RUNTIME_ENV_SETUP.md` → "Runtime Configuration" |
| Database setup | `backend/BACKEND_SETUP.md` → "Getting Started" |

---

## 💾 Memory System Integration

### What's Saved for Persistent Access

**Location:** `~/.claude/projects/E--AMNIL-PROJECTS-Research-Claude/memory/`

| File | Type | Purpose |
|------|------|---------|
| `backend_architecture.md` | Project | Complete backend implementation |
| `react_query_integration.md` | Feedback | React Query decisions |
| `project_tech_stack.md` | Project | Full tech stack overview |
| `MEMORY.md` | Index | Quick links to memory files |

### How to Use Memory

**For agents:**
```typescript
// When user asks about React Query
1. Check memory: react_query_integration.md
2. Understand: What decisions were made
3. Reference: The patterns that work
4. Provide: Consistent guidance
```

**For developers:**
```
// In next session
Agent loads memory → Knows full context → Less explanation needed
```

---

## 🎯 Document Mapping for Common Tasks

### Task: Create New Feature (Full-Stack)

**Workflow:**
1. Backend entity → `backend/BACKEND_SETUP.md` → "Add New Entity"
2. Frontend hooks → `frontend/REACT_QUERY_INTEGRATION.md` → "Product Hooks"
3. Frontend component → `frontend/DOCS.md` → "Common Tasks"
4. Integration test → `docs/INTEGRATION_GUIDE.md`

**Files to reference:**
- `CLAUDE.md` (conventions)
- `knowledge/wiki/backend.md` (patterns)
- `knowledge/wiki/frontend.md` (patterns)

### Task: Debug API Issue

**Workflow:**
1. Check network → `docs/INTEGRATION_GUIDE.md` → "Network Activity"
2. Check CORS → `backend/DOCS.md` → "Troubleshooting"
3. Check endpoint → `backend/BACKEND_SETUP.md` → "API Endpoints"
4. Check config → `frontend/REACT_19_RUNTIME_ENV_SETUP.md` → "Configuration Priority"

### Task: Deploy to Production

**Workflow:**
1. Build → `backend/BUILD_NOTES.md` → "Publish for Production"
2. Docker → `backend/BUILD_NOTES.md` → "Docker Build"
3. Frontend → `frontend/REACT_19_RUNTIME_ENV_SETUP.md` → "Deployment"
4. Integration → `docs/INTEGRATION_GUIDE.md` → "Full Stack Verification"

---

## 📊 Token Efficiency Gains

### Example: Comparison

**Without Organized Docs:**
```
User: "How do I create an API endpoint?"
Agent: [Explains all of backend architecture from scratch]
       [30 min conversation, 5000+ tokens]
```

**With Organized Docs:**
```
User: "How do I create an API endpoint?"
Agent: "Follow backend/BACKEND_SETUP.md → 'Add New Entity' section.
        Here are the 9 steps with code snippets..."
       [2 min conversation, 500 tokens]
```

**Savings:** 90% token reduction, 15x faster

### When Docs Save Most Tokens

✅ **Onboarding new team members** (100+ messages saved)  
✅ **Debugging issues** (references instead of explanations)  
✅ **Building features** (copy-paste from examples)  
✅ **Between sessions** (memory + docs = instant context)  
✅ **Code review** (reference conventions instead of explaining)  

---

## 🔗 How Agents Should Reference Docs

### Good Practice ✅

```markdown
Follow the steps in [backend/BACKEND_SETUP.md](../backend/BACKEND_SETUP.md) 
section "Add New Entity" for your new Order feature.
```

### Better Practice ✅✅

```markdown
1. Create entity in Domain layer (see backend/BACKEND_SETUP.md → "Add New Entity")
2. Create DTOs in Application.Contracts (template in same section)
3. Run migration: `dotnet ef migrations add` (see backend/BUILD_NOTES.md)
```

### Best Practice ✅✅✅

```markdown
For your new Order entity:

**Step 1:** Domain/Orders/Order.cs
[Code example from backend/BACKEND_SETUP.md]

**Step 2:** Application.Contracts/Orders/OrderDto.cs
[Code example]

[etc...]

Full details: backend/BACKEND_SETUP.md → "Add New Entity"
```

---

## 🚀 Getting Started with Docs

### For New Agents

1. **First run:**
   - Read: `README.md` (2 min)
   - Skim: `CLAUDE.md` (5 min)
   - Bookmark: `docs/README.md` (reference)

2. **For each request:**
   - Check what's being asked
   - Find relevant doc in table above
   - Quote/reference instead of explaining

3. **For complex requests:**
   - Search memory system first
   - Reference multiple docs
   - Provide example + link to full guide

### For New Humans

1. Start reading: `README.md`
2. Then: `docs/SETUP_STATUS.md`
3. Then: Relevant guide (frontend or backend)
4. Always: Reference CLAUDE.md for conventions

---

## 📋 Documentation Checklist

**For maintaining docs:**

- [ ] Every feature has a corresponding doc
- [ ] Every pattern has an example
- [ ] Every error has a troubleshooting section
- [ ] Quick reference (DOCS.md) in each folder
- [ ] Links to detailed guides in quick reference
- [ ] Memory system updated with architectural decisions
- [ ] Code examples are copy-pasteable
- [ ] No duplicate information across docs

---

## 🎓 Teaching with Docs

**When someone needs to learn a concept:**

Instead of:
```
"Here's a 10-minute explanation of React Query..."
```

Do:
```
"Read frontend/REACT_QUERY_INTEGRATION.md sections 1-3.
Then try the example in section 4.
Ask me about anything that's unclear."
```

**Result:** 
- They learn from authoritative source
- You save tokens
- Consistent information
- They can reference later

---

## ✨ Summary

This documentation structure exists to:
1. **Save time** — Find answers in seconds
2. **Save tokens** — Reference docs instead of re-explaining
3. **Save consistency** — Everyone follows same patterns
4. **Enable agents** — Agents can provide accurate guidance quickly
5. **Support growth** — Easy to onboard new team members

**Use it liberally. Reference it always. Update it when patterns change.**

---

## 📞 Quick Links

- **Start here:** [README.md](README.md)
- **Doc index:** [docs/README.md](docs/README.md)
- **Frontend guide:** [frontend/DOCS.md](frontend/DOCS.md)
- **Backend guide:** [backend/DOCS.md](backend/DOCS.md)
- **Integration:** [docs/INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md)
- **Conventions:** [CLAUDE.md](CLAUDE.md)

---

**Last Updated:** 2026-04-10  
**Documentation Status:** ✅ 23 files, fully organized  
**Agent Ready:** ✅ Yes, optimized for token efficiency
