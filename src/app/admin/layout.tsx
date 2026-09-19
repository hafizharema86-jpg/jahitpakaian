import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 font-sans text-gray-900 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#ff8a8a] rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#ff8a8a] rounded-full opacity-20 blur-3xl"></div>

      <div className="w-full max-w-[1400px] h-[95vh] bg-white rounded-[2rem] overflow-hidden flex shadow-2xl relative z-10">
        {/* Sidebar */}
        <aside className="w-[260px] bg-white flex flex-col z-30 shrink-0 border-r border-gray-100">
          <div className="h-20 flex items-center px-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ff5a5f] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">JahitPakaian</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 mt-6">
            <AdminSidebar />
          </div>
          
          <div className="p-6 mt-auto border-t border-gray-50">
            <div className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider pl-2">Workspace</div>
            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs overflow-hidden">
                  <img src={`https://ui-avatars.com/api/?name=${session.name}&background=f3f4f6&color=4b5563`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-semibold text-gray-700">{session.name}</div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full flex flex-col bg-[#f5f7fa] relative overflow-hidden">
          {/* Header */}
          <header className="h-20 bg-white/50 backdrop-blur-sm flex items-center justify-end px-10 sticky top-0 z-20">
            <div className="flex items-center gap-5 ml-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                  <img src={`https://ui-avatars.com/api/?name=${session.name}&background=ff5a5f&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hi, <span className="font-bold">{session.name}</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </header>
          
          <div className="p-8 flex-1 overflow-y-auto w-full max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
