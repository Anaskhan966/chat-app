import Header from "./header";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;
