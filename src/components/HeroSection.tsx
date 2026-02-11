import { Shield, Lock, AlertTriangle, CheckCircle, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="hero-gradient text-primary-foreground py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6 text-sm">
          <Lock className="h-4 w-4" />
          <span>Secure & Confidential Reporting</span>
        </div>

        <h1 className="font-heading text-3xl md:text-5xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
          Report Crypto Fraud &<br />
          <span className="gold-accent">Get Professional Assistance</span>
        </h1>

        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 font-body">
          We help victims document, trace, and report stolen cryptocurrency.
        </p>

        <a
          href="#report"
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-8 py-3 rounded transition-all hover:brightness-110 text-lg"
        >
          <Shield className="h-5 w-5" />
          File a Complaint Now
        </a>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          {[
            { icon: Lock, label: "SSL Secured" },
            { icon: CheckCircle, label: "Verified Service" },
            { icon: Users, label: "10,000+ Cases Handled" },
            { icon: Shield, label: "Data Protected" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded px-4 py-2 text-sm"
            >
              <Icon className="h-4 w-4 gold-accent" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning disclaimer */}
      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-3xl mx-auto bg-primary-foreground/10 border border-accent/40 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 gold-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-1">IMPORTANT SECURITY NOTICE</p>
            <p className="text-sm opacity-90">
              We will <strong>NEVER</strong> ask for your private key, seed phrase, or wallet password. 
              If anyone requests this information, it is a scam. We only require your{" "}
              <strong>public wallet address</strong> for investigation purposes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
