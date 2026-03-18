"use client";

export default function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      
      <div className="relative w-[200px] h-[200px] perspective-[800px]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`crystal crystal-${i}`} />
        ))}
      </div>

      {message && (
        <p className="mt-6 text-lg text-white font-medium">
          {message}
        </p>
      )}
    </div>
  );
}