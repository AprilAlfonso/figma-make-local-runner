import { useState, useEffect, useCallback } from 'react';
import { SlideViewer } from './components/SlideViewer';
import { slides } from './data/slides';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideNavContext } from './contexts/SlideNavContext';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const progressValue = ((currentSlide + 1) / slides.length) * 100;

  // Topic sections — barColor for progress fill, tagBg/tagColor from Carbon tag tokens
  const sections = [
    { label: 'Overview', slides: [0],    barColor: '#565151', tagBg: '#e5e0df', tagColor: '#171414' },
    { label: 'Topic 1',  slides: [1],    barColor: '#6929c4', tagBg: '#e8daff', tagColor: '#6929c4' },
    { label: 'Topic 2',  slides: [2],    barColor: '#007d79', tagBg: '#9ef0f0', tagColor: '#005d5d' },
    { label: 'Topic 3',  slides: [3],    barColor: '#0072c3', tagBg: '#bae6ff', tagColor: '#00539a' },
    { label: 'Topic 4',  slides: [4, 5], barColor: '#0043ce', tagBg: '#d0e2ff', tagColor: '#0043ce' },
    { label: 'Topic 5',  slides: [6, 7], barColor: '#9f1853', tagBg: '#ffd6e8', tagColor: '#9f1853' },
    { label: 'Summary',  slides: [8],    barColor: '#565151', tagBg: '#e5e0df', tagColor: '#171414' },
  ];

  const isFirst = currentSlide === 0;
  const isLast = currentSlide === slides.length - 1;

  const slide = slides[currentSlide];
  if (!slide) return null;

  return (
    <SlideNavContext.Provider value={{ goToSlide }}>
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-medium">Effective Prompting Guide</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A practical guide to getting better results from AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <SlideViewer slide={slide} />
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="border-t border-border px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            {/* Carbon Tag labels — one per section, width-proportional */}
            <div className="flex gap-0.5">
              {sections.map((section) => {
                const widthPct = (section.slides.length / slides.length) * 100;
                const isActive =
                  currentSlide >= section.slides[0] &&
                  currentSlide <= section.slides[section.slides.length - 1];
                return (
                  <div key={section.label} style={{ width: `${widthPct}%` }} className="flex justify-start">
                    <span
                      style={{
                        backgroundColor: section.tagBg,
                        color: section.tagColor,
                        borderRadius: '12px',
                        padding: '0 8px',
                        fontSize: '11px',
                        lineHeight: '18px',
                        height: '18px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontWeight: isActive ? 600 : 400,
                        opacity: isActive ? 1 : 0.55,
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {section.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Segmented progress track — each slide segment is clickable */}
            <div className="flex gap-0.5">
              {sections.map((section) => {
                const sectionWidthPct = (section.slides.length / slides.length) * 100;
                return (
                  <div key={section.label} className="flex gap-0.5" style={{ width: `${sectionWidthPct}%` }}>
                    {section.slides.map((slideIndex) => {
                      const isFilled = currentSlide >= slideIndex;
                      return (
                        <button
                          key={slideIndex}
                          onClick={() => goToSlide(slideIndex)}
                          aria-label={`Go to slide ${slideIndex + 1}`}
                          title={`Slide ${slideIndex + 1}`}
                          className="relative flex-1 h-2 rounded-sm overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <div
                            className="absolute inset-0 rounded-sm transition-all duration-300"
                            style={{
                              width: isFilled ? '100%' : '0%',
                              backgroundColor: section.barColor,
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Slide {currentSlide + 1} of {slides.length}</span>
              <span>{Math.round(progressValue)}% complete</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Previous — Carbon tertiary button */}
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{
                height: '48px',
                padding: '0 16px',
                borderRadius: 0,
                backgroundColor: 'transparent',
                color: isFirst ? '#c6c6c6' : '#0f62fe',
                border: `1px solid ${isFirst ? '#c6c6c6' : '#0f62fe'}`,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (!isFirst) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(15,98,254,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            {/* Next — Carbon primary button */}
            <button
              onClick={goNext}
              disabled={isLast}
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{
                height: '48px',
                padding: '0 16px',
                borderRadius: 0,
                backgroundColor: isLast ? '#c6c6c6' : '#0f62fe',
                color: isLast ? '#8d8d8d' : 'white',
                border: 'none',
                cursor: isLast ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (!isLast) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0050e6';
              }}
              onMouseLeave={(e) => {
                if (!isLast) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0f62fe';
              }}
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
    </SlideNavContext.Provider>
  );
}