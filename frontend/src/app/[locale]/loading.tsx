import LoadingSpinner from "@/components/ui/LoadingSpinner";

// src/app/[locale]/loading.tsx
export default function Loading() {
  return (
          <LoadingSpinner 
            text="Loading ..." 
            size='lg'
          />
  );
} 