import { useEffect, useMemo, useRef, useState } from "react";
import { unboxingVideos } from "../data/unboxingData";

const INITIAL_VIDEOS = 6;
const VIDEO_BATCH = 3;

function VideoCard({ video }) {
  return (
    <article className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_44px_-28px_rgba(31,41,55,0.35)] ring-1 ring-primary/8">
      <div className="aspect-[4/3] overflow-hidden bg-surface-container">
        <video className="h-full w-full object-cover" controls poster={video.poster} preload="metadata">
          <source src={video.videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-secondary">Unboxing Video</p>
        <h3 className="font-headline text-lg font-bold tracking-tight text-on-surface">{video.title}</h3>
        <p className="text-sm font-medium text-on-surface-variant">Product: {video.productName}</p>
        <p className="line-clamp-2 text-sm leading-6 text-on-surface-variant">{video.description}</p>
      </div>
    </article>
  );
}

function VideoCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-primary/8">
      <div className="shimmer-surface aspect-[4/3]" />
      <div className="space-y-2 p-4">
        <div className="shimmer-surface h-3 w-28 rounded-full" />
        <div className="shimmer-surface h-5 w-4/5 rounded-full" />
        <div className="shimmer-surface h-4 w-2/5 rounded-full" />
        <div className="shimmer-surface h-4 w-full rounded-full" />
        <div className="shimmer-surface h-4 w-2/3 rounded-full" />
      </div>
    </article>
  );
}

export default function UnboxingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VIDEOS);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  const filteredVideos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return unboxingVideos;
    }

    return unboxingVideos.filter((video) =>
      [video.title, video.productName, video.description].some((value) => value.toLowerCase().includes(query)),
    );
  }, [searchTerm]);

  const visibleVideos = useMemo(
    () => filteredVideos.slice(0, Math.min(visibleCount, filteredVideos.length)),
    [filteredVideos, visibleCount],
  );

  useEffect(() => {
    setIsRefreshing(true);
    setVisibleCount(INITIAL_VIDEOS);

    const timeoutId = window.setTimeout(() => {
      setIsRefreshing(false);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (isRefreshing || isLoadingMore || visibleCount >= filteredVideos.length || !loadMoreRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsLoadingMore(true);
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [filteredVideos.length, isLoadingMore, isRefreshing, visibleCount]);

  useEffect(() => {
    if (!isLoadingMore) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + VIDEO_BATCH, filteredVideos.length));
      setIsLoadingMore(false);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [filteredVideos.length, isLoadingMore]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(254,202,21,0.14),rgba(255,255,255,1)_24%,rgba(186,230,253,0.12)_100%)] pt-20 pb-32 lg:pt-24 lg:pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
                Unboxing
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-on-surface-variant sm:text-base">
                Browse product unboxing videos and search by product name to find the reveal you want quickly.
              </p>
            </div>
            <label className="flex w-full max-w-xl items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_18px_36px_-24px_rgba(31,41,55,0.3)] ring-1 ring-outline-variant lg:px-5">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
              <input
                className="w-full border-0 bg-transparent text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search unboxing by product name"
                type="search"
                value={searchTerm}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {isRefreshing
              ? Array.from({ length: INITIAL_VIDEOS }).map((_, index) => <VideoCardSkeleton key={index} />)
              : visibleVideos.map((video) => <VideoCard key={video.title} video={video} />)}
            {!isRefreshing && isLoadingMore
              ? Array.from({ length: VIDEO_BATCH }).map((_, index) => <VideoCardSkeleton key={`loading-${index}`} />)
              : null}
          </div>

          {!isRefreshing && filteredVideos.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <h2 className="font-headline text-2xl font-bold text-on-surface">No unboxing videos found</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Try searching with another product name.
              </p>
            </div>
          ) : null}

          {!isRefreshing && visibleCount < filteredVideos.length ? (
            <div ref={loadMoreRef} className="mt-6 flex justify-center">
              <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant shadow-[0_14px_28px_-22px_rgba(31,41,55,0.3)]">
                Scroll to load more
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
