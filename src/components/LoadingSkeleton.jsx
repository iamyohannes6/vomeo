import { motion } from 'framer-motion';

const variants = {
  card: {
    width: 'full',
    height: 'auto',
    padding: '1rem',
    rounded: 'lg',
  },
  compact: {
    width: '200px',
    height: 'auto',
    padding: '0.75rem',
    rounded: 'lg',
  },
  row: {
    width: 'full',
    height: '4rem',
    padding: '0.5rem',
    rounded: 'lg',
  }
};

const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const Skeleton = () => (
    <div className={`animate-pulse bg-base-200 border border-base-300/50 rounded-lg ${
      variant === 'compact' ? 'min-w-[200px] p-3' :
      variant === 'row' ? 'w-full p-2' :
      'w-full p-4'
    }`}>
      <div className="flex items-center gap-4">
        {/* Avatar/Image */}
        <div className={`bg-base-300 rounded-lg flex-shrink-0 ${
          variant === 'compact' ? 'w-10 h-10' :
          variant === 'row' ? 'w-12 h-12' :
          'w-14 h-14'
        }`}></div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-base-300 rounded w-3/4"></div>
          <div className="h-3 bg-base-300 rounded w-1/2"></div>
          {variant !== 'compact' && (
            <div className="h-3 bg-base-300 rounded w-1/3"></div>
          )}
        </div>

        {/* Action Button */}
        <div className={`bg-base-300 rounded-lg flex-shrink-0 ${
          variant === 'compact' ? 'w-16 h-6' :
          'w-20 h-8'
        }`}></div>
      </div>

      {/* Description (not shown in compact variant) */}
      {variant !== 'compact' && (
        <div className="mt-3 space-y-2">
          <div className="h-4 bg-base-300 rounded w-full"></div>
          <div className="h-4 bg-base-300 rounded w-2/3"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`grid gap-4 ${
      variant === 'compact' ? 'grid-flow-col auto-cols-[200px]' :
      'grid-cols-1'
    }`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Skeleton />
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton; 