-- Extend policies table with additional fields for detailed policy pages

-- Add new columns to policies table
ALTER TABLE policies
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS purpose TEXT,
ADD COLUMN IF NOT EXISTS scope TEXT,
ADD COLUMN IF NOT EXISTS responsibility TEXT;

-- Generate slugs for existing policies
UPDATE policies
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing records
ALTER TABLE policies
ALTER COLUMN slug SET NOT NULL;

-- Add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_policies_slug ON policies(slug);

-- Add comment for new columns
COMMENT ON COLUMN policies.slug IS 'URL-friendly identifier for the policy (e.g., privacy-policy)';
COMMENT ON COLUMN policies.purpose IS 'Detailed explanation of the policy purpose';
COMMENT ON COLUMN policies.scope IS 'Scope and applicability of the policy';
COMMENT ON COLUMN policies.responsibility IS 'Responsibilities and compliance requirements';

-- Update existing policies with detailed content
UPDATE policies
SET 
  purpose = CASE title
    WHEN 'Privacy Policy' THEN 'This Privacy Policy outlines how we collect, use, store, and protect your personal information. We are committed to ensuring that your privacy is protected and that we comply with all applicable data protection laws and regulations.'
    WHEN 'Terms of Service' THEN 'These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to be bound by these terms. Please read them carefully to understand your rights and obligations.'
    WHEN 'Cookie Policy' THEN 'This Cookie Policy explains how we use cookies and similar technologies on our website. It describes what cookies are, why we use them, and how you can manage your cookie preferences.'
    WHEN 'Refund Policy' THEN 'Our Refund Policy outlines the conditions under which refunds are granted, the process for requesting a refund, and the timeframes involved. We strive to ensure fair treatment for all customers.'
    WHEN 'Data Security' THEN 'This policy describes the security measures we implement to protect your data from unauthorized access, disclosure, alteration, or destruction. We take data security seriously and continuously update our practices.'
    WHEN 'Accessibility' THEN 'We are committed to ensuring that our website and services are accessible to all users, including those with disabilities. This policy outlines our accessibility standards and ongoing efforts to improve accessibility.'
    ELSE 'This policy outlines our commitments and practices in this area.'
  END,
  scope = CASE title
    WHEN 'Privacy Policy' THEN 'This policy applies to all users of our website and services, including visitors, customers, and partners. It covers all personal information collected through our website, mobile applications, and other digital platforms.'
    WHEN 'Terms of Service' THEN 'These terms apply to all users who access or use our services, regardless of how they access them. This includes our website, mobile applications, APIs, and any other platforms we may offer.'
    WHEN 'Cookie Policy' THEN 'This policy applies to all visitors to our website. It covers all cookies and similar tracking technologies used on our site, including first-party and third-party cookies.'
    WHEN 'Refund Policy' THEN 'This policy applies to all purchases made through our website or services. It covers digital products, subscriptions, and services, with specific conditions for each category.'
    WHEN 'Data Security' THEN 'This policy applies to all data we collect, process, and store, including personal information, business data, and technical information. It covers data at rest, in transit, and in use.'
    WHEN 'Accessibility' THEN 'This policy applies to all our digital properties, including our website, mobile applications, and digital content. We aim to meet or exceed WCAG 2.1 Level AA standards.'
    ELSE 'This policy applies to all users and stakeholders of our services.'
  END,
  responsibility = CASE title
    WHEN 'Privacy Policy' THEN 'We are responsible for protecting your personal information and using it only for legitimate purposes. You are responsible for providing accurate information and keeping your account credentials secure. Both parties must comply with applicable data protection laws.'
    WHEN 'Terms of Service' THEN 'We are responsible for providing the services as described and maintaining reasonable availability. You are responsible for using the services in compliance with these terms and applicable laws. Violations may result in account suspension or termination.'
    WHEN 'Cookie Policy' THEN 'We are responsible for clearly disclosing our cookie usage and providing options to manage preferences. You are responsible for reviewing this policy and managing your cookie settings according to your preferences.'
    WHEN 'Refund Policy' THEN 'We are responsible for processing valid refund requests within the stated timeframes. You are responsible for submitting refund requests within the eligible period and providing necessary documentation. Both parties must act in good faith.'
    WHEN 'Data Security' THEN 'We are responsible for implementing and maintaining appropriate security measures. You are responsible for using strong passwords, keeping credentials confidential, and reporting any security concerns promptly.'
    WHEN 'Accessibility' THEN 'We are responsible for maintaining accessibility standards and addressing reported issues. Users are encouraged to report accessibility barriers. We welcome feedback and continuously work to improve accessibility.'
    ELSE 'Both parties share responsibility for compliance with this policy.'
  END
WHERE purpose IS NULL OR scope IS NULL OR responsibility IS NULL;
