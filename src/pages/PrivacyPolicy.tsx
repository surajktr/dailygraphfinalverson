import { Helmet } from "react-helmet-async";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Dailygraph</title>
        <meta name="description" content="Read Dailygraph's privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <SimpleHeader />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
              <p>
                At Dailygraph ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website dailygraph.in.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
              <h3 className="text-xl font-medium text-foreground mb-2">Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register on our website</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our contact form</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              
              <h3 className="text-xl font-medium text-foreground mb-2 mt-4">Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect certain information, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
              <p>We use the collected information for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To improve our website and user experience</li>
                <li>To send periodic emails and newsletters</li>
                <li>To respond to inquiries and support requests</li>
                <li>To analyze usage patterns and trends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
              <p>
                We may employ third-party companies and services to facilitate our website, provide services on our behalf, or assist us in analyzing how our website is used. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
              <h3 className="text-xl font-medium text-foreground mb-2 mt-4">Google AdSense</h3>
              <p>
                We use Google AdSense to display advertisements. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
              <p>
                The security of your personal information is important to us. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
              <p>
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
