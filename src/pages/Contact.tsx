import { Helmet } from "react-helmet-async";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";
import { Mail, Globe, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Dailygraph</title>
        <meta name="description" content="Get in touch with Dailygraph team. We're here to help with your queries about SSC CGL, CHSL preparation and our educational content." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <SimpleHeader />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">Contact Us</h1>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <section>
              <p className="text-lg">
                We'd love to hear from you! Whether you have questions, feedback, suggestions, or just want to say hello, feel free to reach out to us.
              </p>
            </section>

            <section className="bg-muted/50 rounded-lg p-6 not-prose">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:basicenglishgyan@gmail.com" className="text-primary hover:underline">
                      basicenglishgyan@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Website</p>
                    <a href="https://dailygraph.in" className="text-primary hover:underline">
                      dailygraph.in
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">About Dailygraph</h2>
              <p>
                Dailygraph is a comprehensive educational platform dedicated to helping aspirants prepare for competitive examinations like SSC CGL, SSC CHSL, and other government exams. We provide:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Daily News Articles:</strong> Stay updated with current affairs relevant to competitive exams</li>
                <li><strong>Vocabulary Building:</strong> Enhance your English with synonyms, antonyms, and word meanings</li>
                <li><strong>Idioms & Phrases:</strong> Master commonly asked idioms with detailed explanations</li>
                <li><strong>One-Word Substitutions:</strong> Learn important one-word substitutions for exams</li>
                <li><strong>Current Affairs MCQs:</strong> Practice with multiple-choice questions based on recent events</li>
                <li><strong>Editorial Analysis:</strong> Understand complex topics through simplified explanations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How Can We Help?</h2>
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">General Inquiries</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Questions about our content, platform features, or how to use Dailygraph effectively.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Content Feedback</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Found an error? Have suggestions for improvement? We appreciate your feedback.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Technical Support</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Experiencing issues with our website or app? Let us know and we'll help resolve them.
                  </p>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Collaboration</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Interested in collaborating with us? Reach out to discuss partnership opportunities.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Response Time</h2>
              <p>
                We strive to respond to all inquiries within 24-48 hours. During peak exam seasons, response times may be slightly longer. Thank you for your patience!
              </p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Contact;
