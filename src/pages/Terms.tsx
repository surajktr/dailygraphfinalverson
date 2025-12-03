import { Helmet } from "react-helmet-async";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Dailygraph</title>
        <meta name="description" content="Read Dailygraph's terms of service to understand the rules and regulations for using our platform." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <SimpleHeader />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
              <p>
                By accessing and using Dailygraph (dailygraph.in), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Use License</h2>
              <p>
                Permission is granted to temporarily access the materials on Dailygraph's website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on Dailygraph</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">User Responsibilities</h2>
              <p>As a user of Dailygraph, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information when creating an account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the platform for lawful purposes only</li>
                <li>Not engage in any activity that disrupts or interferes with our services</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
              <p>
                All content on Dailygraph, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of Dailygraph or its content suppliers and is protected by Indian and international copyright laws.
              </p>
              <p>
                The compilation of all content on this site is the exclusive property of Dailygraph and is protected by Indian and international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Educational Content Disclaimer</h2>
              <p>
                The educational content provided on Dailygraph is for informational and study purposes only. While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of this information.
              </p>
              <p>
                Users should verify important information from official sources before relying on it for competitive examinations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
              <p>
                In no event shall Dailygraph or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Dailygraph's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Links</h2>
              <p>
                Dailygraph may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Modifications</h2>
              <p>
                Dailygraph reserves the right to revise these terms of service at any time without notice. By using this website, you agree to be bound by the current version of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
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

export default Terms;
