import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between">
      <div className="text-white text-3xl font-black tracking-tighter italic">
        <a
          href="/"
          className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          CHAT.FLOW
        </a>
      </div>

      <div className="flex items-center space-x-6">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-white/70 hover:text-white font-medium transition-colors">
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="genz-btn genz-gradient text-white">
              Join Now
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="p-1 rounded-full bg-gradient-to-r from-primary to-secondary">
            <div className="rounded-full bg-black p-0.5 flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
