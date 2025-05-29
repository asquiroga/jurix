import { motion } from 'framer-motion';
export default ({ title, className }: { title: string; className?: string }) => {
    return (
        <div className={className ? className : 'mb-5'}>
            <motion.h2
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-2xl font-semibold text-gray-800"
            >
                {title}
            </motion.h2>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="mt-1 h-1 bg-blue-400"
            />
        </div>
    );
};
