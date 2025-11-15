import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  noIndex?: boolean;
  schema?: object | object[]; // Support single schema or array of schemas
}

const defaultImage = "https://storage.googleapis.com/gpt-engineer-file-uploads/UzSD8RN0vxV8yG4nsGmtjwj9YJC3/uploads/1761919607072-Gemini_Generated_Image_ozubhhozubhhozub.png";

const SEO = ({
  title = "Dailygraph - SSC CGL, CHSL Preparation | News Articles & English Practice",
  description = "Dailygraph - Complete SSC CGL, CHSL, Pre & Mains preparation platform. 📰 Daily News Articles 🧠 Difficult Words 🟢 Synonyms 🟠 One-Word Substitution 💬 Idioms & Phrases ✍️ Cloze Test 🔤 Para Jumbles 📖 Reading Comprehension for competitive exams.",
  keywords = "SSC CGL, SSC CHSL, SSC preparation, competitive exams, government exams, news articles, vocabulary, difficult words, synonyms, antonyms, one word substitution, idioms and phrases, cloze test, para jumbles, reading comprehension, English preparation, SSC Pre, SSC Mains, newspaper articles",
  ogTitle,
  ogDescription,
  ogImage = defaultImage,
  ogUrl = "https://dailygraph.in/",
  noIndex = false,
  schema,
}: SEOProps) => {
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;

  // Default Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Dailygraph",
    "url": "https://dailygraph.in",
    "logo": defaultImage,
    "description": "Complete SSC CGL, CHSL, Pre & Mains preparation platform with daily news articles and comprehensive English practice materials.",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": "English"
    }
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dailygraph",
    "url": "https://dailygraph.in",
    "description": "SSC CGL, CHSL preparation platform with news articles and English practice",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dailygraph.in/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Educational Content Schema
  const educationalContentSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "SSC CGL & CHSL Preparation Course",
    "description": "Comprehensive preparation materials for SSC CGL, CHSL, Pre & Mains exams including news articles, vocabulary, grammar, and reading comprehension practice.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Dailygraph",
      "url": "https://dailygraph.in"
    },
    "educationalLevel": "Intermediate",
    "inLanguage": "en",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT1H"
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Dailygraph" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:url" content={ogUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={ogUrl} />
      
      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(educationalContentSchema)}
      </script>
      
      {/* Custom Schema if provided */}
      {schema && (
        Array.isArray(schema) ? (
          schema.map((s, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(s)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )
      )}
    </Helmet>
  );
};

export default SEO;
