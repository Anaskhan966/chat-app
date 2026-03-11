const Header = () => {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      <div className="text-white text-2xl font-bold">
        <a href="#">MyLogo</a>
      </div>

      <div className="flex items-center space-x-4">
        {/* <select className="select select-bordered select-sm bg-white bg-opacity-20 text-white border-white focus:outline-none focus:ring-2 focus:ring-white">
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="es">ES</option>
        </select> */}

        <a
          href="/login"
          className="btn btn-ghost btn-sm text-white hover:bg-white hover:text-blue-700"
        >
          Login
        </a>

        <a href="/signup" className="btn btn-primary btn-sm px-4 py-2">
          Sign Up
        </a>
      </div>
    </header>
  );
};

export default Header;
