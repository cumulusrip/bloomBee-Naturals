import React, { useState, useEffect } from 'react';
import { Play, Pause, Award, Sparkles, MapPin, CheckCircle2, ChevronRight, Volume2, VolumeX, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BloomBeeLogo } from './BloomBeeLogo';

interface StoryScene {
  id: number;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  highlightBadge: string;
  bgGradient: string;
  visualType: 'valleys' | 'bees' | 'comb' | 'jar' | 'family';
}

const SCENES: StoryScene[] = [
  {
    id: 1,
    time: '0:01',
    title: 'The Pristine Valleys of Jammu & Kashmir',
    subtitle: 'Nature Creates Something Extraordinary',
    description: 'High in the mist-kissed alpine valleys of Jammu & Kashmir, untouched by industrial pollution, wild flora blooms at 6,500+ feet above sea level.',
    highlightBadge: 'Sourced from Jammu & Kashmir',
    bgGradient: 'from-[#1E3F20]/90 via-[#2D5A27]/80 to-[#122814]/95',
    visualType: 'valleys',
  },
  {
    id: 2,
    time: '0:02',
    title: '100% Pure Himalayan Flora Nectar',
    subtitle: 'Pollinated by Native Mountain Bees',
    description: 'Indigenous Apis Cerana bees gather nectar from wild Kashmiri clover, apple blossoms, and mountain herbs, creating a rich multi-floral profile.',
    highlightBadge: '100% Pure Honey',
    bgGradient: 'from-[#8A5100]/90 via-[#B46D00]/80 to-[#452718]/95',
    visualType: 'bees',
  },
  {
    id: 3,
    time: '0:04',
    title: 'Zero Heat. Zero Sugar. 100% Raw.',
    subtitle: 'Cold Gravity Filtration Preserves Live Enzymes',
    description: 'Never heated above 35°C, preserving raw diastase enzymes, natural bee pollen, and immunity-boosting antioxidants.',
    highlightBadge: 'No Added Sugar',
    bgGradient: 'from-[#E69500]/90 via-[#D48B00]/80 to-[#783E00]/95',
    visualType: 'comb',
  },
  {
    id: 4,
    time: '0:06',
    title: 'BloomBee Naturals Himalayan Honey (250g)',
    subtitle: 'Sealed Fresh in Lead-Free Glass Jars',
    description: 'Every 250g hexagonal jar is certified with NMR spectroscopy lab testing for zero adulteration and authentic origin verification.',
    highlightBadge: 'Naturally Sweet & Delicious',
    bgGradient: 'from-[#5C3B1E]/90 via-[#8A5100]/80 to-[#2B170B]/95',
    visualType: 'jar',
  },
  {
    id: 5,
    time: '0:08',
    title: 'From the Himalayas to Your Home',
    subtitle: 'Nourishing Wholesome Family Breakfasts',
    description: 'Trusted by families across India for daily immunity, morning warm water rituals, and wholesome nutrition for both kids and adults.',
    highlightBadge: 'Pure Family Wellness',
    bgGradient: 'from-[#1E3F20]/90 via-[#3B6634]/80 to-[#102412]/95',
    visualType: 'family',
  },
];

export const BrandVideoStory: React.FC = () => {
  const { products, openPDP } = useStore();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const activeScene = SCENES[activeSceneIndex];
  const himalayanProduct = products.find((p) => p.id === 'prod-himalayan-honey-250g') || products[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % SCENES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#172E19] text-white shadow-xl border border-[#2D5A27]/40">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E69500]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#4E8D42]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 lg:p-14">
        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <BloomBeeLogo variant="white" size="md" />
            <span className="hidden sm:inline-block h-6 w-px bg-white/20" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#FDE68A] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <MapPin className="w-3 h-3 text-[#F5B324]" />
              Jammu &amp; Kashmir Harvest Film
            </span>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-[#FDE68A] transition-colors px-2 py-1 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Film</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Film</span>
                </>
              )}
            </button>
            <div className="h-3 w-px bg-white/20" />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#F5B324]" />}
            </button>
          </div>
        </div>

        {/* Main Cinema Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Story Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#E69500]/20 border border-[#E69500]/40 text-[#FDE68A] text-xs font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B324]" />
              <span>{activeScene.highlightBadge}</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-[#9ECE94] font-semibold">
                Scene {activeScene.id} of {SCENES.length} • {activeScene.subtitle}
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {activeScene.title}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl">
              {activeScene.description}
            </p>

            {/* Quality Pillars in J&K Valley */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
    

<div className="flex items-center gap-2 text-xs font-bold text-[#FDE68A]">
  <ShieldCheck className="w-4 h-4 text-[#F5B324]" />
  <span>FSSAI Certified</span>
</div>
<p className="text-[11px] text-gray-300 mt-1">
  100% C4 Sugar &amp; Rice Syrup Free
</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9ECE94]">
                  <Heart className="w-4 h-4 text-[#9ECE94]" />
                  <span>No Added Sugar</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1">
                  Pure Raw Bee Nectar Only
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {himalayanProduct && (
                <button
                  onClick={() => openPDP(himalayanProduct)}
                  className="bg-[#E69500] hover:bg-[#D48B00] text-[#1E3F20] font-bold text-sm px-6 py-3 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>Shop Himalayan Honey 250g</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <div className="text-xs text-gray-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F5B324]" />
                <span>Pan-India 5–7 Days Express Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right: Simulated Visual Video Canvas */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black group">
              {/* Scene Dynamic Visual Rendering */}
              {activeScene.visualType === 'valleys' && (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                    alt="Jammu & Kashmir Himalayan Valley"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E3F20]/80 px-2 py-0.5 rounded text-[#D4E8D2]">
                      Kashmir Valley Flora
                    </span>
                    <p className="font-serif text-base sm:text-lg font-bold mt-1">
                      Pristine High-Altitude Alpine Meadows
                    </p>
                  </div>
                </div>
              )}

              {activeScene.visualType === 'bees' && (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1200&q=80"
                    alt="Mountain Bees Pollinating Wildflowers"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E69500]/80 px-2 py-0.5 rounded text-white">
                      100% Pure Himalayan Forage
                    </span>
                    <p className="font-serif text-base sm:text-lg font-bold mt-1">
                      Wild Clover &amp; Himalayan Flower Pollen
                    </p>
                  </div>
                </div>
              )}

              {activeScene.visualType === 'comb' && (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1200&q=80"
                    alt="Golden Raw Honeycomb Drip"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-700/80 px-2 py-0.5 rounded text-[#FDE68A]">
                      Cold Extraction (&lt;35°C)
                    </span>
                    <p className="font-serif text-base sm:text-lg font-bold mt-1">
                      Unheated Gravity Filtration Preserving Active Enzymes
                    </p>
                  </div>
                </div>
              )}

              {activeScene.visualType === 'jar' && (
                <div className="relative w-full h-full bg-[#1A1208] flex items-center justify-center p-6">
                  {/* Decorative Amber Glow */}
                  <div className="absolute w-48 h-48 rounded-full bg-[#E69500]/30 blur-2xl pointer-events-none" />
                  
                  {/* Realistic Product Presentation */}
                  <div className="relative flex flex-col items-center text-center z-10">
                    <div className="relative w-40 sm:w-48 aspect-[4/5] bg-gradient-to-b from-[#FAF8F5] to-[#EFE5D5] rounded-3xl p-4 shadow-2xl border-4 border-[#F5B324]/40 flex flex-col items-center justify-between">
                      {/* Golden Cap */}
                      <div className="w-24 h-4 bg-gradient-to-r from-[#D48B00] via-[#FBBF24] to-[#D48B00] rounded-t-lg shadow-sm border border-[#9A5B00]/40 -mt-2" />
                      
                      {/* Jar Label Simulation */}
                      <div className="w-full bg-[#FAF8F5] rounded-2xl p-3 border border-[#E8DCB8] shadow-inner text-[#2D1B10]">
                        <BloomBeeLogo size="sm" showSubtitle={false} className="justify-center" />
                        <p className="font-serif text-xs font-bold text-[#8A5100] mt-1">
                          Himalayan Honey
                        </p>
                        <span className="inline-block text-[8px] font-bold text-[#2D5A27] bg-[#E8F5E9] px-2 py-0.5 rounded-full mt-0.5">
                          No Added Sugar
                        </span>
                        <div className="flex items-center justify-between text-[8px] font-semibold text-gray-500 mt-2 border-t border-gray-200 pt-1">
                          <span>Net Wt. 250 g</span>
                          <span className="text-[#2D5A27]">● 100% Pure</span>
                        </div>
                      </div>

                      {/* Seal badge */}
                      <div className="text-[9px] font-bold text-[#8A5100] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#F5B324]">
                        Sourced from J&amp;K
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white z-20">
                    <p className="font-serif text-base sm:text-lg font-bold">
                      BloomBee Naturals Himalayan Honey 250g Jar
                    </p>
                  </div>
                </div>
              )}

              {activeScene.visualType === 'family' && (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1200&q=80"
                    alt="Family Breakfast Table with Pure Honey"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1E3F20]/80 px-2 py-0.5 rounded text-[#D4E8D2]">
                      Pure Family Nutrition
                    </span>
                    <p className="font-serif text-base sm:text-lg font-bold mt-1">
                      From the Himalayas to Your Home
                    </p>
                  </div>
                </div>
              )}

              {/* Progress timeline bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-30 flex">
                {SCENES.map((scene, idx) => (
                  <div
                    key={scene.id}
                    className="flex-1 h-full relative cursor-pointer"
                    onClick={() => setActiveSceneIndex(idx)}
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        idx === activeSceneIndex
                          ? 'bg-[#F5B324]'
                          : idx < activeSceneIndex
                          ? 'bg-white/80'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scene Selectors */}
            <div className="flex items-center justify-between gap-1 mt-4">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer truncate ${
                    idx === activeSceneIndex
                      ? 'bg-[#E69500] text-[#1E3F20] shadow-sm'
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                >
                  {scene.highlightBadge}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};