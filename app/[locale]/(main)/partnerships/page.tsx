import { Metadata } from "next";
import { Link as LinkIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Partners and Featured Resources",
    description: "Discover websites and resources that have featured our brain training games and cognitive development tools.",
    keywords: ["partnerships", "backlinks", "featured resources", "collaborations", "brain training resources"],
    openGraph: {
      title: "Our Partners and Resources | FreeFocusGames",
      description: "See where our brain training games have been featured across the web.",
      type: "website",
    }
  }
}

interface BacklinkProps {
  title: string;
  url: string;
  description: string;
  category: string;
  date: string;
}

const backlinkData: BacklinkProps[] = [
  {
    title: "Brain Development Today",
    url: "https://example-brain-development.com/cognitive-games-review",
    description: "A comprehensive review of our memory enhancement games, highlighting their effectiveness for developing working memory.",
    category: "Education",
    date: "2023-10-15"
  },
  {
    title: "Cognitive Psychology Resources",
    url: "https://example-cognitive-psychology.org/tools-for-memory",
    description: "Featured in their list of top 10 recommended tools for improving cognitive functions in adults and children.",
    category: "Psychology",
    date: "2023-11-20"
  },
  {
    title: "ParentingTech Blog",
    url: "https://example-parenting-tech.com/brain-games-for-kids",
    description: "Our games were recommended as educational activities that parents can use to improve their children's attention span.",
    category: "Parenting",
    date: "2024-01-05"
  },
  {
    title: "Senior Health Network",
    url: "https://example-senior-health.net/cognitive-exercises",
    description: "Highlighted our games as effective tools for maintaining cognitive health in older adults and preventing mental decline.",
    category: "Health",
    date: "2024-02-12"
  },
  {
    title: "Educational Technology Review",
    url: "https://example-edtech-review.com/free-brain-training-tools",
    description: "Reviewed our platform's effectiveness for classroom use and home learning environments.",
    category: "Education",
    date: "2024-03-08"
  }
];

function Backlink({ title, url, description, category, date }: BacklinkProps) {
  return (
    <div className="border rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold flex items-center">
          <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
          <Link href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-700 mb-3">{description}</p>
      <div className="flex justify-between items-center">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {category}
        </span>
        <Link href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
          Visit Website →
        </Link>
      </div>
    </div>
  );
}

export default function PartnershipsPage() {
  // Group backlinks by category
  const categories = [...new Set(backlinkData.map(item => item.category))];
  
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-center mb-10">
        <LinkIcon className="w-8 h-8 mr-2 text-blue-600" />
        <h1 className="text-3xl font-bold text-center">Our Partners & Featured Resources</h1>
      </div>
      
      <div className="mb-8">
        <p className="text-lg mb-4">
          We are proud to be featured on these reputable websites that recognize the value of our brain training games and cognitive development tools. These partnerships help us reach more users and continue our mission of providing free, accessible brain training for everyone.
        </p>
        <p className="text-lg mb-6">
          If you&apos;re interested in featuring our tools or collaborating with us, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
        </p>
      </div>
      
      {categories.map(category => (
        <div key={category} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">{category} Resources</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {backlinkData
              .filter(item => item.category === category)
              .map((item, index) => (
                <Backlink key={index} {...item} />
              ))
            }
          </div>
        </div>
      ))}
      
      <div className="mt-10 p-5 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">About Our Backlinks</h2>
        <p>
          This page was last updated on {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}. 
          We regularly update this list to include new resources and partnerships. The links above represent websites that have 
          featured our content or services. We appreciate their support in helping us reach a wider audience.
        </p>
      </div>
    </div>
  );
} 