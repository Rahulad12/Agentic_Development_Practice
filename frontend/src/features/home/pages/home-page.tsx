function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">AMNIL Research Claude</h1>
          <p className="text-xl text-slate-300 mb-8">
            Enterprise-grade monorepo with React frontend and .NET backend
          </p>

          <div className="bg-slate-800 rounded-lg p-8 mb-8 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="text-left space-y-4 text-slate-300">
              <div>
                <h3 className="font-semibold text-white mb-2">✅ Frontend Initialized</h3>
                <p className="text-sm">React 18 + TypeScript + Vite + Tailwind CSS 4.2</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🚀 Next Steps</h3>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>Initialize backend with ABP CLI</li>
                  <li>Configure database connection</li>
                  <li>Run migrations: <code className="bg-slate-900 px-2 py-1 rounded">dotnet run</code></li>
                  <li>Start development servers</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">📚 Documentation</h3>
                <p className="text-sm">Read <code className="bg-slate-900 px-2 py-1 rounded">CLAUDE.md</code> and <code className="bg-slate-900 px-2 py-1 rounded">knowledge/wiki/README.md</code></p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-400">
            <p>Frontend running on: <code className="bg-slate-900 px-2 py-1 rounded">http://localhost:5173</code></p>
            <p>Backend API: <code className="bg-slate-900 px-2 py-1 rounded">https://localhost:44300</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
