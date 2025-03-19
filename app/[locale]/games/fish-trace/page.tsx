import { Metadata } from 'next'
import Game from './components/Game'
import { GamePageTemplate } from '@/components/GamePageTemplate'
import { Eye, Focus, Target } from 'lucide-react'

export const metadata: Metadata = {
    title: "Glowing Fish Trace - Visual Tracking & Attention Training Game",
    description:
        "Improve visual tracking abilities by following glowing fish in a dynamic underwater environment. Train your attention, working memory, and focus through progressive challenges.",
    keywords: [
        "visual tracking exercise",
        "attention training game",
        "fish tracking game",
        "working memory practice",
        "visual focus training",
        "multiple object tracking",
        "cognitive enhancement game",
        "visual attention exercise",
    ].join(", "),
    openGraph: {
        title: "Glowing Fish Trace - Train Your Visual Tracking Skills",
        description: "Follow the glowing fish and remember which ones were highlighted. Enhance your visual attention and working memory through engaging underwater challenges.",
        images: [{ url: "/og/oglogo.png", width: 1200, height: 630 }],
    }
};

export default function FishTracePage() {
  return (
      <GamePageTemplate
          gameBackground='bg-gradient-to-b from-cyan-300 via-blue-500 to-blue-800 dark:from-cyan-900 dark:via-blue-950 dark:to-slate-950'
          gameId="fish-trace"
          title="Glowing Fish Trace"
          subtitle="Train your visual tracking and sustained attention"
          gameComponent={<Game />}
          howToPlay={
              <>
                  <p>
                      Follow the glowing fish in this underwater tracking
                      challenge:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>
                          Watch carefully as certain fish glow with colored
                          circles
                      </li>
                      <li>
                          Keep tracking those fish even after the circles
                          disappear
                      </li>
                      <li>
                          When prompted, click on the fish that had the glowing
                          circles
                      </li>
                      <li>
                          As you improve, more fish will appear and move faster
                      </li>
                  </ul>
              </>
          }
          benefits={[
              {
                  icon: <Eye className="w-10 h-10" />,
                  title: "Visual Tracking",
                  description:
                      "Improve your ability to follow moving objects and maintain visual focus in dynamic environments.",
              },
              {
                  icon: <Focus className="w-10 h-10" />,
                  title: "Sustained Attention",
                  description:
                      "Enhance your capacity to maintain concentration on specific targets over extended periods.",
              },
              {
                  icon: <Target className="w-10 h-10" />,
                  title: "Selective Attention",
                  description:
                      "Develop your ability to focus on relevant stimuli while ignoring distractions.",
              },
          ]}
          faq={[
              {
                  question:
                      "How does visual tracking training benefit everyday life?",
                  answer: "Strong visual tracking skills are essential for reading, driving, sports, and navigating busy environments. This training can help improve performance in all these areas.",
              },
              {
                  question: "Is this suitable for children?",
                  answer: "Yes! This game is excellent for children and adults alike. Visual tracking training is particularly beneficial for developing readers and those with attention difficulties.",
              },
              {
                  question: "How long should each training session be?",
                  answer: "Aim for 10-15 minute sessions. Quality of attention is more important than duration - it's better to do shorter sessions with full concentration than longer ones with diminished focus.",
              },
              {
                  question: "Can this help with reading difficulties?",
                  answer: "Yes, many reading difficulties are connected to visual tracking problems. Regular practice with this game may help improve reading fluency and comprehension by strengthening the visual tracking system.",
              },
          ]}
      />
  );
} 