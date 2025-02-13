export function GameIntro() {
  return (
    <div className="prose dark:prose-invert">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">How to Play</h2>
          <ol className="space-y-2 text-muted-foreground">
            <li>Click &ldquo;Start Game&rdquo; to begin</li>
            <li>Watch carefully as blocks light up in a pattern</li>
            <li>After the pattern disappears, click the blocks in the same order</li>
            <li>Complete the pattern correctly to advance to the next level</li>
            <li>The game gets progressively harder with more blocks to remember</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Benefits</h2>
          <ul className="grid grid-cols-2 gap-2 text-muted-foreground">
            <li>Improves spatial memory</li>
            <li>Enhances concentration</li>
            <li>Develops pattern recognition</li>
            <li>Trains visual attention</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 