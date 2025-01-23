import { MegaphoneIcon } from '@heroicons/react/24/outline';

const PromoSection = ({ promo, isSecondary = false }) => {
  if (!promo?.title) return null;

  const hasImage = Boolean(promo.image);
  const hasCta = Boolean(promo.ctaLink && promo.ctaText);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* Background Image with Gradient Overlay */}
      {hasImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${promo.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 to-surface/80" />
        </>
      )}

      {/* Content */}
      <div className={`relative ${hasImage ? 'p-8' : 'p-6 bg-surface border border-base-300'} rounded-xl`}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <MegaphoneIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-100 line-clamp-2">
                {promo.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 line-clamp-3">
            {promo.description}
          </p>

          {/* CTA Button */}
          {hasCta && (
            <div className="mt-2">
              <a
                href={promo.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {promo.ctaText}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoSection; 