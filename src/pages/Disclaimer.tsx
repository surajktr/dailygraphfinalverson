import { Helmet } from "react-helmet-async";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";

const Disclaimer = () => {
  return (
    <>
      <Helmet>
        <title>Disclaimer - Dailygraph</title>
        <meta name="description" content="Read Dailygraph's disclaimer regarding the use of educational content and information provided on our platform." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <SimpleHeader />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">Disclaimer</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">General Disclaimer</h2>
              <p>
                The information provided on Dailygraph (dailygraph.in) is for general informational and educational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Educational Content Disclaimer</h2>
              <p>
                Dailygraph provides study materials, current affairs, vocabulary questions, and other educational content intended to help aspirants prepare for competitive examinations. Please note:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The content is prepared by our editorial team and may contain errors or inaccuracies.</li>
                <li>Information should be cross-verified with official sources before use in examinations.</li>
                <li>We do not guarantee success in any examination based on using our materials.</li>
                <li>Exam patterns, syllabi, and official information may change; always refer to official notifications.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">No Professional Advice</h2>
              <p>
                The site cannot and does not contain professional educational advice. The educational information is provided for general informational purposes only and is not a substitute for professional advice from qualified educators or official examination bodies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">External Links Disclaimer</h2>
              <p>
                The site may contain links to external websites that are not provided or maintained by or in any way affiliated with Dailygraph. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Fair Use Disclaimer</h2>
              <p>
                This website may contain copyrighted material, the use of which may not have been specifically authorized by the copyright owner. This material is available in an effort to advance understanding of educational issues. We believe this constitutes a "fair use" of any such copyrighted material as provided for in Section 52 of the Indian Copyright Act.
              </p>
              <p>
                If you wish to use copyrighted material from this site for purposes that go beyond "fair use," you must obtain permission from the copyright owner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">News and Current Affairs</h2>
              <p>
                News articles and current affairs content on Dailygraph are compiled from various sources. While we strive for accuracy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>News content is for educational purposes related to competitive exams.</li>
                <li>We are not a news agency and do not claim to provide breaking news.</li>
                <li>Facts and figures should be verified from primary sources.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Errors and Omissions</h2>
              <p>
                While we have made every attempt to ensure that the information contained on this site is accurate, we are not responsible for any errors or omissions, or for the results obtained from the use of this information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Consent</h2>
              <p>
                By using our website, you hereby consent to our disclaimer and agree to its terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p>
                If you have any questions or concerns about this disclaimer, please contact us at:
              </p>
              <p className="font-medium">Email: basicenglishgyan@gmail.com</p>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Disclaimer;
