import Header from "./Header";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f4f1ec] px-3 py-4 text-neutral-900 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1400px] flex-col rounded-[18px] border border-neutral-300 bg-[#fbfaf7] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.08)] md:p-6">
        <Header />
        <main className="mt-2 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
