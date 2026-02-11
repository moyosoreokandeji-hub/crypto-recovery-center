import { Shield, Lock, AlertTriangle, CheckCircle, Phone, Mail, FileText } from "lucide-react";

const Header = () => {
  return (
    <>
      {/* Gov-style top banner */}
      <div className="gov-banner py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Crypto Fraud Assistance Center</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-card border-b-2 gold-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-heading font-bold text-foreground leading-tight">
                Crypto Fraud Help Center
              </h1>
              <p className="text-xs text-muted-foreground">
                Professional Cryptocurrency Fraud Assistance
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#report" className="hover:text-foreground transition-colors flex items-center gap-1">
              <FileText className="h-4 w-4" />
              File a Report
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Contact
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
