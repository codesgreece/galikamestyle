"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ContactModal } from "@/components/ui/ContactModal";
import type { ContactPreset } from "@/lib/types";

type ContactContextValue = {
  openContact: (preset?: Partial<ContactPreset>) => void;
  closeContact: () => void;
};

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContactModal() {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactProvider");
  }
  return ctx;
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<Partial<ContactPreset>>({});

  const openContact = useCallback((next?: Partial<ContactPreset>) => {
    setPreset(next ?? {});
    setOpen(true);
  }, []);

  const closeContact = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openContact, closeContact }),
    [openContact, closeContact],
  );

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactModal open={open} onClose={closeContact} preset={preset} />
    </ContactContext.Provider>
  );
}
