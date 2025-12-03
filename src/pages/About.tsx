import { Helmet } from "react-helmet-async";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Dailygraph | SSC CGL, CHSL Preparation Platform</title>
        <meta name="description" content="Learn about Dailygraph - Your trusted platform for SSC CGL, CHSL preparation with daily news articles, vocabulary, and English practice materials." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <SimpleHeader />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">About Dailygraph</h1>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Who We Are</h2>
              <p>
                Welcome to <strong>Dailygraph</strong>, your comprehensive online platform dedicated to helping aspirants prepare for competitive examinations like SSC CGL, SSC CHSL, and other government exams. We are passionate educators and content creators committed to making quality education accessible to everyone.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p>
                Our mission is to provide high-quality, up-to-date study materials that help students excel in their competitive exams. We believe that every aspirant deserves access to quality educational resources, regardless of their background or location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Daily News Articles:</strong> Stay updated with current affairs through our carefully curated news articles relevant to competitive exams.</li>
                <li><strong>Vocabulary Building:</strong> Enhance your English vocabulary with synonyms, antonyms, and word meanings.</li>
                <li><strong>Idioms & Phrases:</strong> Master commonly asked idioms and phrases with detailed explanations.</li>
                <li><strong>One-Word Substitutions:</strong> Learn important one-word substitutions frequently asked in exams.</li>
                <li><strong>Current Affairs MCQs:</strong> Practice with multiple-choice questions based on recent news and events.</li>
                <li><strong>Editorial Analysis:</strong> Understand complex topics through our simplified editorial explanations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
              <p>
                We are committed to providing accurate, well-researched content that helps you succeed. Our team regularly updates the platform with fresh content to ensure you always have access to the latest study materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose Dailygraph?</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free access to quality study materials</li>
                <li>Daily updated content</li>
                <li>User-friendly interface</li>
                <li>Mobile-responsive design for learning on the go</li>
                <li>Bilingual content (English & Hindi) for better understanding</li>
              </ul>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
