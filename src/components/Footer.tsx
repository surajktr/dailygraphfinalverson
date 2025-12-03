import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary mb-2">Dailygraph</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Your complete SSC CGL, CHSL preparation platform with daily news articles, vocabulary, and English practice.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <span className="text-border">|</span>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span className="text-border">|</span>
            <Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">
              Disclaimer
            </Link>
            <span className="text-border">|</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border w-full">
            <p>© {currentYear} Dailygraph. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
