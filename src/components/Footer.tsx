import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm text-muted-foreground">
          <span>© {currentYear} Dailygraph</span>
          <span className="hidden md:inline">|</span>
          <Link to="/about" className="hover:text-foreground transition-colors underline">
            About Us
          </Link>
          <span className="hidden md:inline">|</span>
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors underline">
            Privacy Policy
          </Link>
          <span className="hidden md:inline">|</span>
          <Link to="/terms" className="hover:text-foreground transition-colors underline">
            Terms of Service
          </Link>
          <span className="hidden md:inline">|</span>
          <Link to="/disclaimer" className="hover:text-foreground transition-colors underline">
            Disclaimer
          </Link>
          <span className="hidden md:inline">|</span>
          <Link to="/contact" className="hover:text-foreground transition-colors underline">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
