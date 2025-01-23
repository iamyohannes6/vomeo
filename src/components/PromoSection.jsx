import { MegaphoneIcon } from '@heroicons/react/24/solid';

const PromoSection = ({ promo }) => {
  if (!promo) return null;

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