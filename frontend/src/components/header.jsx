import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-transparent px-6 py-4 flex items-center justify-between">
      <div className="text-white text-2xl font-bold">
        <a href="/">MyLogo</a>
      </div>

      <div className="flex items-center space-x-4">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-ghost btn-sm text-white hover:bg-white hover:text-blue-700">
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn btn-primary btn-sm px-4 py-2">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
