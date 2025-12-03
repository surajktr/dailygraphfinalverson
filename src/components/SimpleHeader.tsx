import { Link } from "react-router-dom";

const SimpleHeader = () => {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Dailygraph
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default SimpleHeader;
