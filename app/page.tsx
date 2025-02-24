import type { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card"
import { GamePreview as SimonGamePreview } from "./games/simonsays/components/GamePreview"
import { GamePreview as SchulteGamePreview } from "./games/schulte_table/components/GamePreview"
import { ImagePreview } from "@/components/image-preview"
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
<meta name="keywords" content=""></meta>
export const metadata: Metadata = {
    title: "Free Focus & Memory Games | FreeFocusGames",
    description:
        "Play free focus games at FreeFocusGames.com to improve memory and concentration!",
    keywords:
        "free focus games, memory games, free memory games, games to improve memory, focus and concentration games, freefocusgames, brain games for focus, free matching games",
};

export default function Home() {
  return (
      <div className="md:py-12">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto mb-24 p-6 md:p-12 rounded-3xl text-center">
              <div className="">
                  <h1 className="font-outfit text-2xl sm:text-4xl font-bold mb-6 inline-flex flex-wrap items-center justify-center gap-x-4">
                      Free Focus Games to Boost
                      <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                          Memory
                      </span>
                      <span>and</span>
                      <span className="bg-gradient-to-r from-blue-400 via-green-400 to-cyan-500 bg-clip-text text-transparent">
                          Concentration
                      </span>
                  </h1>
                  <p className="sm:text-xl ">
                      Play Free Brain Games Online Anytime
                  </p>
              </div>
          </section>

          {/* Games Section */}
          <section className="mb-24 max-w-[1400px] mx-auto">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">Popular Games</h2>
                  <Button variant="ghost">View All →</Button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-10">
                  <GameCard
                      title="Simon Says"
                      description="Strengthen focus & pattern recognition"
                      slug="simonsays"
                      preview={<SimonGamePreview />}
                  />
                  <GameCard
                      title="Schulte Table"
                      description="Enhance your attention and peripheral vision"
                      slug="schulte_table"
                      preview={<SchulteGamePreview />}
                  />
                  <GameCard
                      title="Glowing Fish Trace"
                      description="Master visual tracking by following glowing fish patterns"
                      slug="fishtrace"
                      preview={<ImagePreview src="/games/fish-trace.png" />}
                  />
                  <GameCard
                      title="Frog Memory Leap"
                      description="Enhance Sequential Memory & Spatial Recall Through Progressive Challenges"
                      slug="frog_memory_leap"
                      preview={<ImagePreview src="/games/frog-path.png" />}
                  />
              </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-24 max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-8">
                  Focus: Your Secret Superpower
              </h2>

              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                      Imagine: Your child stays on task without constant
                      reminders, you nail meeting priorities effortlessly, and
                      finally get lost in that book you&apos;ve been meaning to
                      read. That&apos;s the power of trained focus.
                  </p>

                  <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                      <div className="shrink-0 text-2xl">👨👧</div>
                      <div>
                          <h3 className="font-medium mb-2 text-foreground">
                              Family Life
                          </h3>
                          <p>
                              Help kids complete homework faster with fewer
                              distractions. Be fully present during family time
                              without mental clutter.
                          </p>
                      </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                      <div className="shrink-0 text-2xl">💼</div>
                      <div>
                          <h3 className="font-medium mb-2 text-foreground">
                              Work Performance
                          </h3>
                          <p>
                              Say goodbye to zoning out in meetings. Achieve
                              flow state faster and handle complex tasks with
                              crystal-clear thinking.
                          </p>
                      </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-background/50 rounded-xl">
                      <div className="shrink-0 text-2xl">🎯</div>
                      <div>
                          <h3 className="font-medium mb-2 text-foreground">
                              Personal Growth
                          </h3>
                          <p>
                              Whether learning new skills or pursuing hobbies,
                              strong focus helps you make progress twice as
                              fast.
                          </p>
                      </div>
                  </div>

                  <p className="text-center mt-8">
                      Just 10 minutes daily - it&apos;s like weightlifting for
                      your brain.
                      <br />
                      <span className="text-primary font-medium">
                          Sharper focus, better life.
                      </span>
                  </p>
              </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-24 max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                  Real People, Real Results
              </h2>

              <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6">
                  <Marquee pauseOnHover className="[--duration:20s] mb-8">
                      {[
                          {
                              name: "Sarah",
                              username: "@sarah_writes",
                              body: "Finally finished my novel draft after 3 years of procrastination!",
                              gradient: "from-blue-400 to-cyan-500",
                          },
                          {
                              name: "Mike",
                              username: "@chef_mike",
                              body: "Can now follow complex baking recipes without getting distracted",
                              gradient: "from-purple-400 to-pink-500",
                          },
                          {
                              name: "Emma",
                              username: "@nature_em",
                              body: "Remember every turn on our mountain hikes - no more getting lost!",
                              gradient: "from-green-400 to-emerald-500",
                          },
                          {
                              name: "Sophia",
                              username: "@math_mom",
                              body: "My son's math scores improved 2 grades after 3 months!",
                              gradient: "from-rose-400 to-pink-500",
                          },
                          {
                              name: "Liam",
                              username: "@adhd_dad",
                              body: "15 mins/day helped my daughter sit through homework time",
                              gradient: "from-sky-400 to-blue-500",
                          },
                      ].map((review) => (
                          <div key={review.username} className="mx-4 w-72">
                              <div
                                  className={cn(
                                      "relative h-full cursor-pointer overflow-hidden rounded-xl border p-6",
                                      "bg-background/80 hover:bg-border/10",
                                      "border"
                                  )}
                              >
                                  <div className="flex flex-col gap-4">
                                      <div className="flex items-center gap-2">
                                          <div
                                              className={`h-16 w-16 rounded-full bg-gradient-to-r ${review.gradient}`}
                                          />
                                          <div className="">
                                              <h3 className="text-lg font-semibold">
                                                  {review.name}
                                              </h3>
                                              <p className="text-sm text-muted-foreground">
                                                  {review.username}
                                              </p>
                                          </div>
                                      </div>
                                      <blockquote className="mt-2 text-sm">
                                          {review.body}
                                      </blockquote>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </Marquee>

                  <Marquee reverse pauseOnHover className="[--duration:20s]">
                      {[
                          {
                              name: "Tom",
                              username: "@movie_tom",
                              body: "Actually catch plot twists in movies now - no more confusion!",
                              gradient: "from-orange-400 to-red-500",
                          },
                          {
                              name: "Lisa",
                              username: "@organized_lisa",
                              body: "Spot my keys instantly in messy rooms - lifesaver!",
                              gradient: "from-yellow-400 to-amber-500",
                          },
                          {
                              name: "David",
                              username: "@dad_athlete",
                              body: "Never miss my kid's soccer goals anymore",
                              gradient: "from-indigo-400 to-violet-500",
                          },
                          {
                              name: "Olivia",
                              username: "@homeschool_olivia",
                              body: "Cut learning time by 40% with focused practice",
                              gradient: "from-teal-400 to-cyan-500",
                          },
                          {
                              name: "Ethan",
                              username: "@gaming_dad",
                              body: "Now balance game time and study time effortlessly",
                              gradient: "from-amber-400 to-orange-500",
                          },
                      ].map((review) => (
                          <div key={review.username} className="mx-4 w-72">
                              <div
                                  className={cn(
                                      "relative h-full cursor-pointer overflow-hidden rounded-xl border p-6",
                                      "bg-background/80 hover:bg-border/10",
                                      "border"
                                  )}
                              >
                                  <div className="flex flex-col gap-4">
                                      <div className="flex items-center gap-2">
                                          <div
                                              className={`h-16 w-16 rounded-full bg-gradient-to-r ${review.gradient}`}
                                          />
                                          <div className="">
                                              <h3 className="text-lg font-semibold">
                                                  {review.name}
                                              </h3>
                                              <h4 className="text-sm text-muted-foreground">
                                                  {review.username}
                                              </h4>
                                          </div>
                                      </div>
                                      <blockquote className="mt-2 text-sm">
                                          {review.body}
                                      </blockquote>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </Marquee>

                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
              </div>
          </section>
      </div>
  );
}
