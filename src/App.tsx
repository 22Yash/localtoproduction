import { modules, allLessons, getLessonById } from './data/modules';

export function App() {
  const flagship = getLessonById('nginx-load-balancing');

  return (
    <main className="min-h-screen bg-bg text-ink p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="border-b border-divider pb-4">
          <h1 className="text-2xl font-bold tracking-tight">ShipToProd</h1>
          <p className="text-sm opacity-80 mt-1">
            Phase 1 Foundation: Design tokens, course schema, 7 modules ({modules.length}), 28 lessons ({allLessons.length}).
          </p>
        </header>

        {flagship && (
          <section className="bg-surface border border-ink rounded-lg p-6 shadow-hard space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold bg-accent px-2.5 py-1 rounded border border-ink">
                Flagship Lesson ({flagship.difficulty})
              </span>
              <span className="text-xs text-ink/70">{flagship.minutes} min</span>
            </div>

            <div>
              <h2 className="text-lg font-bold">{flagship.title}</h2>
              <p className="text-sm text-ink/80 mt-1">{flagship.subtitle}</p>
            </div>

            <div className="pt-2 border-t border-divider text-xs space-y-1">
              <p><strong>Steps configured:</strong> {flagship.steps.length}</p>
              <p><strong>Step 1:</strong> {flagship.steps[0]?.title}</p>
              <p><strong>Step 6:</strong> {flagship.steps[5]?.title}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
