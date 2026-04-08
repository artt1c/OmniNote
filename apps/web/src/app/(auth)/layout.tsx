import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#000000] text-[#e2e8e0] selection:bg-[#4a6741]/30 flex flex-col items-center justify-between p-6 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f110f_0%,#000000_100%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4a6741]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4a6741]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex-1 flex items-center justify-center w-full z-10">
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#7a634a]/60 gap-4 mt-8 z-10 transition-opacity">
        <div className="font-medium whitespace-nowrap">OMNINOTE DIGITAL SANCTUARY</div>

        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-[#e2e8e0] transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-[#e2e8e0] transition-colors">TERMS</a>
          <a href="#" className="hover:text-[#e2e8e0] transition-colors">SUPPORT</a>
        </div>

        <div className="font-medium whitespace-nowrap">© 2026 OMNINOTE DIGITAL SANCTUARY</div>
      </footer>
    </div>
  );
}
