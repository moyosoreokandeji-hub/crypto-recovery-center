import { Shield, Lock, FileText } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <span className="font-heading font-bold">Crypto Fraud Help Center</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Providing professional assistance to cryptocurrency fraud victims. 
              We help document, trace, and report stolen digital assets.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Disclaimer</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Security</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 opacity-80">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2 opacity-80">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs opacity-60">
          <p>
            © {new Date().getFullYear()} Crypto Fraud Help Center. All rights reserved. 
            This service is intended for informational and reporting purposes only. 
            We are not a law firm and do not provide legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
