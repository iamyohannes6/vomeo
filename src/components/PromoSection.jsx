import { MegaphoneIcon } from '@heroicons/react/24/solid';

const PromoSection = ({ promo, variant = 'standard' }) => {
  if (!promo) return null;

  if (variant === 'hero') {
    return (
      <div className="relative h-[300px] rounded-lg overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {promo.image ? (
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/10" />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {promo.title}
          </h2>
          <p className="text-gray-200 mb-4 max-w-2xl">
            {promo.description}
          </p>
          {promo.ctaLink && (
            <a
              href={promo.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base w-fit"
            >
              {promo.ctaText || 'Learn More'}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Standard variant
  return (
    <div className="bg-surface border border-base-300 rounded-lg p-4 md:p-6">
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="p-2 bg-primary/10 rounded-lg">
          <MegaphoneIcon className="w-6 h-6 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            {promo.title}
          </h2>
          <p className="text-gray-400 mb-4">
            {promo.description}
          </p>
          
          {/* Optional CTA Button */}
          {promo.ctaLink && (
            <a
              href={promo.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              {promo.ctaText || 'Learn More'}
            </a>
          )}
        </div>

        {/* Optional Image */}
        {promo.image && (
          <div className="hidden md:block flex-shrink-0">
            <img
              src={promo.image}
              alt={promo.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoSection; 