'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
    apiId: string;
    initialIsFavorite: boolean;
}

export default function FavoriteButton({ apiId, initialIsFavorite }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // prevent navigating to API detail page

        if (isLoading) return;

        setIsLoading(true);
        // Optimistic UI
        setIsFavorite(!isFavorite);

        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiId }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                }
                throw new Error('Failed to toggle favorite');
            }

            const data = await res.json();
            setIsFavorite(data.favorited);
            router.refresh(); // Tell NextJS to refresh server props where this is used (e.g. Dashboard)
        } catch (error) {
            console.error(error);
            // Revert optimistic UI on failure
            setIsFavorite(isFavorite);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`p-2 rounded-full backdrop-blur-sm transition-all absolute top-3 right-3 z-10 
        ${isFavorite
                    ? 'bg-amber-100/80 text-amber-500 hover:bg-amber-200/80 hover:scale-110 shadow-sm'
                    : 'bg-white/80 text-[var(--muted)] hover:bg-gray-100 hover:text-[var(--ink)] hover:scale-110'
                }
      `}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            <Star
                className={`w-5 h-5 transition-all ${isFavorite ? 'fill-current' : ''}`}
            />
        </button>
    );
}
