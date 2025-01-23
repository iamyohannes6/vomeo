import { MegaphoneIcon } from '@heroicons/react/24/solid';

const PromoSection = ({ promo, variant = 'standard' }) => {
  if (!promo) return null;

  const isHero = variant === 'hero';

  return (
    <div className={`relative rounded-lg overflow-hidden ${isHero ? 'h-[300px]' : 'h-[200px]'}`}>
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
        <h2 className={`font-bold text-white mb-3 ${isHero ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
          {promo.title}
        </h2>
        <p className="text-gray-200 mb-4 max-w-2xl line-clamp-2">
          {promo.description}
        </p>
        {promo.ctaLink && (
          <a
            href={promo.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-fit ${
              isHero ? 'text-sm md:text-base' : 'text-sm'
            }`}
          >
            {promo.ctaText || 'Learn More'}
          </a>
        )}
      </div>
    </div>
  );
};

export default PromoSection; 