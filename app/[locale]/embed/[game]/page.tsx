import { notFound, redirect } from 'next/navigation'

// Supported games list
const SUPPORTED_GAMES = [
  'schulte-table',
  'dual-n-back',
  'reaction-time',
  'fish-trace',
  'block-memory-challenge',
  'frog-memory-leap',
  'larger-number',
  'mahjong-dual-n-back'
];

// Game titles mapping
const getGameTitle = (game: string): string => {
  const titles: Record<string, string> = {
    'schulte-table': 'Schulte Table',
    'dual-n-back': 'Dual N-Back',
    'reaction-time': 'Reaction Time',
    'fish-trace': 'Fish Trace',
    'block-memory-challenge': 'Block Memory Challenge',
    'frog-memory-leap': 'Frog Memory Leap',
    'larger-number': 'Larger Number',
    'mahjong-dual-n-back': 'Mahjong Dual N-Back'
  };
  
  return titles[game] || 'Focus Game';
};

// Currently implemented embedded games
const IMPLEMENTED_GAMES = [
  'schulte-table'
];

export default async function Page({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  
  // Check if game is supported
  if (!SUPPORTED_GAMES.includes(game)) {
    notFound();
  }
  
  // Check if embedded version is implemented
  if (IMPLEMENTED_GAMES.includes(game)) {
    // Redirect to specific embed page
    redirect(`/embed/${game}`);
  }
  
  // Other games not yet implemented
  const gameTitle = getGameTitle(game);
  
  return (
    <>
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Embedded version coming soon</h2>
        <p>
          <a 
            href={`https://freefocusgames.com/games/${game}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Visit the full {gameTitle} game
          </a>
        </p>
      </div>
      
      {/* Hidden backlink for SEO */}
      <a 
        href={`https://freefocusgames.com/games/${game}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="sr-only"
      >
        {gameTitle} by Free Focus Games
      </a>
    </>
  );
}