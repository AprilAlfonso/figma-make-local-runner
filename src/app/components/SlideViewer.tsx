import { Slide } from '../data/slides';

interface SlideViewerProps {
  slide: Slide;
}

export function SlideViewer({ slide }: SlideViewerProps) {
  if (!slide) return null;

  const { Content } = slide;

  return (
    <div className="animate-fadeIn">
      {/* Carbon Tag — badge */}
      <span
        className="mb-4 inline-flex items-center uppercase tracking-wide"
        style={{
          backgroundColor: slide.badge.bgColor,
          color: slide.badge.color,
          borderRadius: '12px',
          padding: '0 8px',
          fontSize: '12px',
          lineHeight: '18px',
          height: '18px',
          fontWeight: 400,
        }}
      >
        {slide.badge.text}
      </span>

      {/* Title */}
      <h2 className="text-3xl font-medium text-foreground mb-2 leading-tight">
        {slide.title}
      </h2>

      {/* Subtitle */}
      <p className="text-base text-muted-foreground mb-6 leading-relaxed">
        {slide.subtitle}
      </p>

      {/* Content — rendered as a proper component */}
      <div className="text-foreground">
        <Content />
      </div>
    </div>
  );
}