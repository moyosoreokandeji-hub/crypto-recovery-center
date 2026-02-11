import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ComplaintForm from "@/components/ComplaintForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ComplaintForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
