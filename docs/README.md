# Documentation Index

Complete documentation for AMNIL Research Claude full-stack monorepo.

## 🎯 Quick Navigation

### **New to the Project?**
Start here → [`SETUP_STATUS.md`](./SETUP_STATUS.md) (5 min read)

### **Want to Build Features?**
1. Frontend: [`../frontend/DOCS.md`](../frontend/DOCS.md)
2. Backend: [`../backend/DOCS.md`](../backend/DOCS.md)
3. Integration: [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)

### **Setting Up Locally?**
- Frontend: [`../frontend/REACT_19_RUNTIME_ENV_SETUP.md`](../frontend/REACT_19_RUNTIME_ENV_SETUP.md)
- Backend: [`../backend/BACKEND_SETUP.md`](../backend/BACKEND_SETUP.md)
- Build Issues: [`../backend/BUILD_NOTES.md`](../backend/BUILD_NOTES.md)

---

## 📚 All Documentation

### Root Level

| File | Purpose | Read Time |
|------|---------|-----------|
| [`SETUP_STATUS.md`](./SETUP_STATUS.md) | Project status checklist | 5 min |
| [`PROJECT_COMPLETE.md`](./PROJECT_COMPLETE.md) | Full project summary | 10 min |
| [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md) | Frontend ↔ Backend testing | 15 min |
| [`architecture.md`](./architecture.md) | System design & decisions | 10 min |
| [`DECISIONS.md`](./DECISIONS.md) | Architecture decision records | 5 min |

### Frontend Documentation

Located in [`../frontend/`](../frontend/)

| File | Purpose | Read Time |
|------|---------|-----------|
| `DOCS.md` | Frontend quick reference | 5 min |
| `REACT_19_RUNTIME_ENV_SETUP.md` | React 19 + runtime config | 20 min |
| `REACT_QUERY_INTEGRATION.md` | Data fetching & caching | 15 min |

### Backend Documentation

Located in [`../backend/`](../backend/)

| File | Purpose | Read Time |
|------|---------|-----------|
| `DOCS.md` | Backend quick reference | 5 min |
| `BACKEND_SETUP.md` | Complete backend guide | 30 min |
| `BACKEND_COMPLETE.md` | Implementation summary | 10 min |
| `BUILD_NOTES.md` | Build troubleshooting | 5 min |

### Knowledge Base

Located in [`../knowledge/wiki/`](../knowledge/wiki/)

| File | Purpose |
|------|---------|
| `frontend.md` | React conventions & patterns |
| `backend.md` | .NET/ABP conventions |
| `conventions.md` | Code style standards |

---

## 🏗️ Project Structure

```
AMNIL_PROJECTS/Research_Claude/
│
├── frontend/
│   ├── DOCS.md                    ← Frontend quick reference
│   ├── REACT_19_RUNTIME_ENV_SETUP.md
│   ├── REACT_QUERY_INTEGRATION.md
│   ├── src/
│   └── ...
│
├── backend/
│   ├── DOCS.md                    ← Backend quick reference
│   ├── BACKEND_SETUP.md
│   ├── BACKEND_COMPLETE.md
│   ├── BUILD_NOTES.md
│   ├── src/
│   ├── test/
│   └── ...
│
├── docs/                          ← You are here
│   ├── README.md                  (this file)
│   ├── SETUP_STATUS.md
│   ├── PROJECT_COMPLETE.md
│   ├── INTEGRATION_GUIDE.md
│   ├── architecture.md
│   └── DECISIONS.md
│
├── knowledge/wiki/
│   ├── frontend.md
│   ├── backend.md
│   └── conventions.md
│
├── CLAUDE.md                      ← Master project guide
│
└── ...
```

---

## 🚀 Quick Commands

### Frontend
```bash
cd frontend
npm run dev              # Start dev server (http://localhost:5173)
npm run build           # Build for production
npm run type-check      # TypeScript check
```

### Backend
```bash
cd backend
dotnet restore          # Get packages
dotnet build           # Compile
cd src/MyApp.DbMigrator && dotnet run  # Run migrations
cd ../MyApp.HttpApi.Host && dotnet run # Start server (https://localhost:44300)
```

### Full Stack
```bash
# Terminal 1
cd frontend && npm run dev

# Terminal 2
cd backend/src/MyApp.HttpApi.Host && dotnet run

# Open browser
# Frontend: http://localhost:5173
# Backend:  https://localhost:44300/swagger
```

---

## 📋 Technology Stack

### Frontend
- **React** 19 (JSX without imports)
- **Vite** 6.4 (lightning-fast dev server)
- **TypeScript** 5 (strict mode)
- **Tailwind CSS** 4.2 (@theme syntax)
- **shadcn/ui** (component library)
- **React Query** (data fetching & caching)
- **React Router** v7 (routing)
- **Zustand** (UI state management)

### Backend
- **.NET** 9.0 (LTS)
- **ASP.NET Core** 9.0 (web framework)
- **Entity Framework Core** 9.0 (ORM)
- **ABP Framework** 8.1.3 (enterprise architecture)
- **SQL Server** (database)
- **AutoMapper** (object mapping)
- **Serilog** (structured logging)

---

## ✅ What's Included

| Component | Status | Location |
|-----------|--------|----------|
| Frontend setup | ✅ Complete | `frontend/` |
| Backend setup | ✅ Complete | `backend/` |
| React 19 + runtime config | ✅ Complete | `frontend/REACT_19_RUNTIME_ENV_SETUP.md` |
| React Query integration | ✅ Complete | `frontend/REACT_QUERY_INTEGRATION.md` |
| ABP architecture (9 projects) | ✅ Complete | `backend/src/` |
| Product CRUD example | ✅ Complete | `backend/src/` |
| API documentation | ✅ Complete | `backend/BACKEND_SETUP.md` |
| Integration guide | ✅ Complete | `INTEGRATION_GUIDE.md` |
| Type definitions | ✅ Complete | Frontend & Backend |
| CORS configured | ✅ Complete | `backend/src/MyApp.HttpApi.Host/` |
| Database migrations | ✅ Complete | `backend/src/MyApp.DbMigrator/` |
| Error handling | ✅ Complete | Both stacks |
| Logging | ✅ Complete | Both stacks |

---

## 🎓 Learning Path

### For Frontend Developers
1. Read: `../frontend/DOCS.md`
2. Read: `../frontend/REACT_19_RUNTIME_ENV_SETUP.md`
3. Read: `../frontend/REACT_QUERY_INTEGRATION.md`
4. Follow: `INTEGRATION_GUIDE.md` (steps 1-5)
5. Build: Create a new feature in `src/features/`

### For Backend Developers
1. Read: `../backend/DOCS.md`
2. Read: `../backend/BACKEND_SETUP.md`
3. Read: `../backend/BUILD_NOTES.md`
4. Follow: `INTEGRATION_GUIDE.md` (steps 1-4)
5. Build: Create a new entity following Product pattern

### For Full-Stack Developers
1. Read: `PROJECT_COMPLETE.md` (overview)
2. Follow: `INTEGRATION_GUIDE.md` (complete walkthrough)
3. Read: Both `frontend/DOCS.md` and `backend/DOCS.md`
4. Build: Create end-to-end features

---

## 🔗 Key Resources

| Resource | Purpose | Link |
|----------|---------|------|
| Project Setup | All instructions | [`CLAUDE.md`](../CLAUDE.md) |
| Architecture | System design | [`architecture.md`](./architecture.md) |
| Frontend Conventions | Code style | [`../knowledge/wiki/frontend.md`](../knowledge/wiki/frontend.md) |
| Backend Conventions | Code style | [`../knowledge/wiki/backend.md`](../knowledge/wiki/backend.md) |
| ABP Framework | Official docs | https://abp.io/docs |
| React Query | Official docs | https://tanstack.com/query/latest |
| Tailwind CSS 4 | Official docs | https://tailwindcss.com/docs |

---

## 💡 Common Questions

### "Where do I start?"
→ Read [`SETUP_STATUS.md`](./SETUP_STATUS.md)

### "How do I set up the frontend?"
→ See [`../frontend/REACT_19_RUNTIME_ENV_SETUP.md`](../frontend/REACT_19_RUNTIME_ENV_SETUP.md)

### "How do I set up the backend?"
→ See [`../backend/BACKEND_SETUP.md`](../backend/BACKEND_SETUP.md)

### "How does frontend talk to backend?"
→ See [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)

### "How do I create a new feature?"
→ See `frontend/DOCS.md` and `backend/DOCS.md`

### "What's the architecture?"
→ See [`architecture.md`](./architecture.md)

### "I'm getting a build error"
→ See [`../backend/BUILD_NOTES.md`](../backend/BUILD_NOTES.md)

### "React/TypeScript help needed"
→ See [`../knowledge/wiki/frontend.md`](../knowledge/wiki/frontend.md)

### "C#/.NET help needed"
→ See [`../knowledge/wiki/backend.md`](../knowledge/wiki/backend.md)

---

## 📝 Documentation Status

✅ **100% Complete**

- ✅ Setup guides (frontend & backend)
- ✅ Architecture documentation
- ✅ Technology guides (React 19, React Query, ABP)
- ✅ Integration testing guide
- ✅ Code conventions & patterns
- ✅ Troubleshooting guides
- ✅ API reference (Swagger live)
- ✅ Quick references for each folder

---

## 🎯 Next Steps

1. ✅ Read [`SETUP_STATUS.md`](./SETUP_STATUS.md) (where you are)
2. ✅ Start [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md) (to test both servers)
3. ✅ Read appropriate tech guide (`frontend/` or `backend/`)
4. ✅ Start building your features

---

**Everything is documented and ready. No more setup needed!** 🚀
