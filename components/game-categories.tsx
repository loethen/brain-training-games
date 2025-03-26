import { Link } from "@/i18n/navigation";
import { getGameCategories } from "@/data/games";
import {
    Brain,
    Focus,
    Zap,
    Puzzle,
    Eye,
    Target,
    Split,
    Shuffle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, getCategory } from "@/data/categories";
import { useTranslations } from "next-intl";

const iconMap: Record<string, React.ReactNode> = {
    Brain: <Brain className="h-4 w-4" />,
    Focus: <Focus className="h-4 w-4" />,
    Zap: <Zap className="h-4 w-4" />,
    PuzzlePiece: <Puzzle className="h-4 w-4" />,
    Eye: <Eye className="h-4 w-4" />,
    Target: <Target className="h-4 w-4" />,
    Split: <Split className="h-4 w-4" />,
    Shuffle: <Shuffle className="h-4 w-4" />,
};

interface GameCategoriesProps {
    gameId: string;
    className?: string;
    displayAll?: boolean;
    showDescription?: boolean;
}

export default function GameCategories({
    gameId,
    className,
    displayAll = false,
    showDescription = false,
}: GameCategoriesProps) {
    const t = useTranslations("categories");
    const displayCategories =
        gameId === "all" || displayAll 
            ? categories 
            : getGameCategories(gameId).map(categoryId => getCategory(categoryId)).filter(Boolean);

    if (displayCategories.length === 0) return null;

    if (gameId === "all" || displayAll) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayCategories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="block p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            {category.icon && (
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    {iconMap[category.icon] || (
                                        <div className="w-6 h-6" />
                                    )}
                                </div>
                            )}
                            <h2 className="font-semibold">
                                {t(`categoryNames.${category.id}`, {
                                    defaultMessage: category.name,
                                })}
                            </h2>
                        </div>
                        {showDescription && (
                            <p className="text-muted-foreground text-sm">
                                {t(`categoryDescriptions.${category.id}`, {
                                    defaultMessage: category.description,
                                })}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {displayCategories.map((category) => (
                <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="px-2 py-1 bg-muted rounded-md hover:bg-muted transition-colors flex items-center gap-1 text-sm mt-2"
                >
                    {category.icon && iconMap[category.icon]}
                    {t(`categoryNames.${category.id}`, {
                        defaultMessage: category.name,
                    })}
                </Link>
            ))}
        </div>
    );
}
