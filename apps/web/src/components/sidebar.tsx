'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { Box, Dialog, IconButton, Theme, VisuallyHidden } from '@radix-ui/themes';
import type { IUser } from '@repo/types';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const SIDEBAR_BG = '#0b0d10';

export function Sidebar({ user }: { user: IUser }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        display={{ initial: 'none', md: 'block' }}
        width="16rem"
        flexShrink="0"
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        <Theme appearance="dark" style={{ height: '100%', backgroundColor: SIDEBAR_BG }}>
          <SidebarNav user={user} />
        </Theme>
      </Box>

      <Box
        display={{ initial: 'block', md: 'none' }}
        p="3"
        style={{ borderBottom: '1px solid var(--gray-a5)' }}
      >
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger>
            <IconButton variant="soft" aria-label="Open menu">
              <Menu size={18} />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content
            maxWidth="16rem"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              margin: 0,
              height: '100%',
              maxHeight: '100%',
              borderRadius: 0,
              padding: 0,
              backgroundColor: SIDEBAR_BG,
            }}
          >
            <VisuallyHidden>
              <Dialog.Title>Navigation</Dialog.Title>
            </VisuallyHidden>
            <Theme appearance="dark" style={{ height: '100%', backgroundColor: SIDEBAR_BG }}>
              <SidebarNav user={user} onNavigate={() => setOpen(false)} />
            </Theme>
          </Dialog.Content>
        </Dialog.Root>
      </Box>
    </>
  );
}
