import Header from "./header";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Decorative background blobs for Gen Z vibe */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <Header />
      <main className="flex-1 flex flex-col container mx-auto p-4 z-10">
        <div className="flex-1 glass-card rounded-3xl overflow-hidden flex flex-col">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Layout;
