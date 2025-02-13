export default function GamesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container">
      <div className="py-12">
        {children}
      </div>
    </div>
  )
} 