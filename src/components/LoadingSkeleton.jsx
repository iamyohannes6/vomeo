import { motion } from 'framer-motion';

const variants = {
  card: "min-h-[120px] bg-base-200 rounded-xl p-4",
  compact: "min-h-[80px] bg-base-200 rounded-lg p-3",
  promo: "min-h-[200px] bg-base-200 rounded-xl",
  profile: "min-h-[150px] bg-base-200 rounded-xl p-6",
};

const LoadingSkeleton = ({ variant = "card", count = 1 }) => {
  const Skeleton = () => (
    <div className={`animate-pulse ${variants[variant]}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-base-300"></div>
        <div className="flex-1">
          <div className="h-4 bg-base-300 rounded w-3/4"></div>
          <div className="h-3 bg-base-300 rounded w-1/2 mt-2"></div>
          <div className="h-3 bg-base-300 rounded w-1/3 mt-2"></div>
        </div>
        {variant !== "profile" && (
          <div className="w-24 h-8 bg-base-300 rounded-lg"></div>
        )}
      </div>
      {variant === "card" && (
        <>
          <div className="h-4 bg-base-300 rounded w-full mt-3"></div>
          <div className="h-4 bg-base-300 rounded w-2/3 mt-2"></div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
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