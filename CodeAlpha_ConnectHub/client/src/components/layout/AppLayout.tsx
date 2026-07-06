import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { LeftSidebar } from './LeftSidebar';
import { MobileNav } from './MobileNav';
import { RightSidebar } from './RightSidebar';
import { CreatePostModal } from '../post/CreatePostModal';

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px]">
      <LeftSidebar onCreate={() => setOpen(true)} />
      <main className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-6 lg:max-w-2xl lg:px-8 xl:max-w-3xl">
        <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line bg-paper/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="text-xl font-black text-ink">ConnectHub</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <RightSidebar />
      <MobileNav onCreate={() => setOpen(true)} />
      <CreatePostModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
