'use client'

import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PublicHeader title="Privacy Policy" />

      <main className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">1. Information We Collect</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>The CareerToDo Platform collects various types of information to provide and improve our services. Below is a detailed breakdown of what information we collect, how we use it, and your rights regarding your information.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Personal Information</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      When you create an account, we collect personal information such as your name, email address, date of birth, role, and other identifying information. This information is used to create your account, authenticate you, and provide personalized services.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Professional Information</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Through your use of the Platform, you may provide professional information including your major, university, employer details, or investor profile. This information helps us match you with appropriate opportunities and provide relevant services.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Work History</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      The Platform records your work history, including projects you participate in, roles you hold, tasks you complete, and achievements you earn. This information is used to build your professional portfolio, assess your performance, and verify your experience.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Reputation & Ratings</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      The Platform collects multi-dimensional reputation ratings from other users, including execution, collaboration, leadership, ethics, and reliability scores. This information is used to provide a comprehensive view of your capabilities and performance.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Communication Data</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      The Platform may collect communications data such as messages, notifications, and interactions with other users. This information is used to facilitate platform features, provide customer support, and improve user experience.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">2. How We Use Your Information</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>We use your information for various purposes, including providing and improving our services, communicating with you, complying with legal obligations, and analyzing platform usage patterns. Below is a breakdown of how we use your information.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Service Provision</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use your information to provide, maintain, and improve the Platform's services. This includes creating and managing your account, processing requests, delivering notifications, and facilitating platform features.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Authentication & Security</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use your information for authentication purposes, verifying your identity, and securing your account. This includes using your email and password for login, implementing multi-factor authentication where applicable, and monitoring for suspicious activity.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Personalization & Analytics</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use your information to personalize your experience and analyze platform usage. This includes customizing dashboards, providing relevant recommendations, and aggregating statistics to improve platform functionality.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Communication</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use your information to communicate with you about platform updates, security alerts, and other important information. This includes sending email notifications, displaying in-app messages, and providing customer support.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Legal Compliance</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use your information to comply with applicable laws and regulations, including responding to legal requests, conducting audits, and maintaining required records.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">3. Information Sharing</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>We may share your information with third parties in certain circumstances, as described below. We will not share your information with third parties without your consent, except as required by law.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">With Other Users</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Your professional profile, work history, and reputation ratings may be shared with employers, investors, and other stakeholders based on your privacy settings and the nature of your relationship.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">With Universities</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Your student information, project participation, and performance metrics may be shared with your affiliated university based on your privacy settings and the university's role in the verification process.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">With Service Providers</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may share your information with third-party service providers who help us operate the Platform, such as cloud hosting providers, analytics services, and payment processors.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">With Legal Authorities</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may share your information with legal authorities when required by law, such as responding to subpoenas, court orders, or regulatory inquiries.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">4. Data Security</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>We implement industry-standard security measures to protect your information from unauthorized access, use, or disclosure. Below is an overview of our security practices.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Encryption</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use encryption to protect your information in transit and at rest. All sensitive data, including passwords, personal information, and professional records, is encrypted using industry-standard encryption algorithms.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Access Controls</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We implement access controls to ensure that only authorized personnel can access your information. This includes role-based access, need-to-know basis, and regular access reviews.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Secure Storage</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use secure storage solutions and follow best practices for data management. Your information is stored on secure servers with regular backups and disaster recovery procedures in place.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Monitoring & Auditing</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We monitor platform activity and conduct regular security audits to identify and address potential vulnerabilities. This includes monitoring for unauthorized access, suspicious activity, and security incidents.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Vulnerability Management</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We have processes in place to identify, assess, and remediate security vulnerabilities in a timely manner. This includes regular security assessments, penetration testing, and bug bounty programs.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">5. Your Rights</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>You have certain rights regarding your personal information as described below. We respect and protect these rights in accordance with applicable privacy laws.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Access</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to access, review, and update your personal information at any time. You can also request deletion of your account and associated information.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Rectification</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to request correction of inaccurate or incomplete personal information. We will make reasonable efforts to correct such information promptly.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Erasure</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to request deletion of your personal information, subject to certain legal obligations. We will delete your information unless we have a legitimate business reason to retain it.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Object</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to object to certain types of information processing, including automated decision-making, profiling, and direct marketing. You can configure your preferences and opt out of certain processing activities.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Withdraw Consent</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to withdraw your consent at any time for the collection, use, or sharing of your personal information, where applicable. Withdrawal of consent may result in the inability to use certain platform features.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Complaint</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to file a complaint with a supervisory authority regarding our handling of your personal information. We will respond to your complaint in accordance with applicable laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Right to Data Portability</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      You have the right to receive a copy of your personal information in a commonly used, machine-readable format. You can request that we transfer your data to another service provider.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">6. Data Retention</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>We retain your personal information for different periods depending on the type of information and the purpose of processing. Below is an overview of our data retention practices.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Active Accounts</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For active accounts, we retain your personal information for the duration of your account. Upon account termination, we will delete or anonymize your personal information in accordance with applicable laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Inactive Accounts</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For inactive accounts, we may delete or anonymize your personal information after a specified period of inactivity, subject to applicable legal requirements.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Project & Task Data</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We retain project and task data for as long as necessary to fulfill the purposes for which it was collected, including for record-keeping, compliance, and legal obligations.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Reputation & Ratings Data</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We retain reputation and ratings data for as long as necessary to maintain accurate profiles and support platform functionality. Historical ratings may be anonymized after a specified period.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Communications Data</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We retain communications data for as long as necessary to provide customer support, maintain records, and comply with legal obligations. This may include message histories, notification logs, and support tickets.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Analytics & Usage Data</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may retain analytics and usage data for business purposes, including improving platform functionality, analyzing trends, and developing new features. This data may be anonymized or aggregated.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">7. Changes to Privacy Policy</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. Your continued use of the Platform after such changes constitutes acceptance of the updated policy.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Material Changes</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may make material changes to this Privacy Policy and will notify you of any such changes that significantly affect your rights or our use of your personal information. We will provide a summary of the changes and your options.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Periodic Reviews</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We will review this Privacy Policy periodically to ensure it remains accurate, up-to-date, and compliant with applicable laws and best practices.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Effective Date</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Any changes to this Privacy Policy will become effective on the date specified in the revised policy. Your continued use of the Platform after the effective date constitutes acceptance of the updated policy.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Contact Us</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      If you have any questions or concerns about this Privacy Policy, please contact us at: support@CareerToDo.com. We will make reasonable efforts to address your inquiries in a timely manner.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">8. Third-Party Services</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>The Platform may use third-party services to provide certain features and functionality. Below is an overview of such services and our commitment to protecting your information.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Cloud Hosting & Storage</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use third-party cloud hosting providers to store your information securely. These providers are contractually obligated to maintain industry-standard security practices and comply with applicable data protection laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Analytics Services</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may use third-party analytics services to understand platform usage and improve user experience. These services collect anonymous usage data and are configured to respect your privacy choices.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Email Services</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We use third-party email services to send notifications and communications. These services are contractually obligated to protect your email address and comply with applicable data protection laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Payment Processors</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may use third-party payment processors for handling transactions. These providers are subject to their own privacy policies and security practices. We recommend reviewing their policies before making payments.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Authentication Services</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may use third-party authentication services for single sign-on and identity verification. These services are subject to their own privacy policies and terms of use.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Support Services</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We may use third-party support services to provide customer assistance. These services have access to limited information necessary to provide support and are subject to confidentiality agreements.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">9. International Data Transfers</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>If your information is transferred to or processed in a country other than where we are located, we will ensure appropriate safeguards are in place to protect your information in accordance with applicable international data transfer laws.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Adequacy of Protection</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We will ensure that appropriate technical and organizational measures are in place to protect your information during international transfers, including encryption and access controls.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Regulatory Compliance</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We will comply with all applicable international data transfer laws and regulations, including but not limited to GDPR, CCPA, and other regional data protection frameworks.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">User Rights</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We will ensure that your rights under applicable international data transfer laws are protected, including the right to information, access, rectification, erasure, and objection.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Contractual Safeguards</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We will require third-party recipients to maintain appropriate contractual safeguards to protect your information in accordance with applicable international data transfer laws and regulations.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Notification</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We will notify you when your information is transferred to another country and provide information about the applicable laws and regulations governing such transfers.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">10. Children's Privacy</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>The Platform is not intended for children under the age of 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Collection from Children</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We do not knowingly collect personal information from children under 13. If we accidentally collect such information, we will delete it immediately.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Deletion upon Request</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      If we become aware that we have collected personal information from a child under 13, we will delete it promptly upon request from the child's parent or legal guardian.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Parental Consent</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We do not knowingly collect personal information from children under 13 without verifiable parental consent. If we become aware of such collection without consent, we will delete the information immediately.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Educational Resources</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      We provide educational resources for parents and guardians regarding children's privacy and security online. These resources include tips for safe online behavior, information about privacy settings, and guidance on monitoring children's platform use.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Reporting to Authorities</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      If we become aware of violations of children's privacy laws, we will report such violations to appropriate authorities and cooperate with investigations.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">11. Contact Information</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>If you have any questions, concerns, or complaints about this Privacy Policy or our handling of your personal information, please contact us using the information below:</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">General Inquiries</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For general inquiries about the Platform, privacy practices, or this Privacy Policy, please contact us at:
                    </p>
                    <p className="text-sm text-slate-600">
                      Email: <a href="mailto:support@CareerToDo.com" className="text-blue-600 hover:underline">support@CareerToDo.com</a>
                    </p>
                    <p className="text-sm text-slate-600">
                      We will make reasonable efforts to respond to your inquiries within 5-7 business days.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Data Subject Rights</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      To exercise your rights regarding your personal information, please contact our Data Protection Officer (DPO) at:
                    </p>
                    <p className="text-sm text-slate-600">
                      Email: <a href="mailto:dpo@CareerToDo.com" className="text-blue-600 hover:underline">dpo@CareerToDo.com</a>
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Privacy Complaints</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      If you wish to file a privacy complaint or have concerns about how your personal information is being handled, please contact our independent supervisory authority or the relevant data protection authority in your jurisdiction.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Legal Inquiries</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For legal inquiries regarding this Privacy Policy or our handling of personal information, please contact our legal department at:
                    </p>
                    <p className="text-sm text-slate-600">
                      Email: <a href="mailto:legal@CareerToDo.com" className="text-blue-600 hover:underline">legal@CareerToDo.com</a>
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Emergency Contact</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For urgent security concerns or data breaches involving your personal information, please contact our emergency hotline immediately:
                    </p>
                    <p className="text-sm text-slate-600">
                      Email: <a href="mailto:emergency@CareerToDo.com" className="text-blue-600 hover:underline">emergency@CareerToDo.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">12. Jurisdiction & Governing Law</h2>
              <div className="prose max-w-none text-slate-600 space-y-4">
                <p>This Privacy Policy and your use of the Platform shall be governed by and construed in accordance with the laws of the jurisdiction in which you reside when accessing or using the Platform.</p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Applicable Jurisdictions</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For users in the United States, this Privacy Policy shall be governed by the laws of the United States, including but not limited to the California Consumer Privacy Act (CCPA) and the General Data Protection Regulation.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">European Union</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For users in the European Union, this Privacy Policy shall be governed by the General Data Protection Regulation (GDPR) and other applicable EU data protection laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">United Kingdom</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For users in the United Kingdom, this Privacy Policy shall be governed by the UK Data Protection Act 2018 and other applicable UK data protection laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Canada</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For users in Canada, this Privacy Policy shall be governed by the Personal Information Protection and Electronic Documents Act (PIPEDA) and other applicable Canadian data protection laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Australia</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For users in Australia, this Privacy Policy shall be governed by the Privacy Act 1988 and other applicable Australian data protection laws.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Other Jurisdictions</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For users in other jurisdictions, this Privacy Policy shall be governed by the applicable data protection and privacy laws of such jurisdictions.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Governing Law Selection</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      In the event of a conflict between the laws of different jurisdictions, the law that provides the greater protection for your personal information shall prevail, to the extent permitted by applicable law.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Cross-Border Data Transfers</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      For cross-border data transfers, we will ensure that appropriate safeguards are in place and that transfers comply with applicable international data transfer laws and regulations.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Dispute Resolution</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Any disputes regarding your personal information and our handling thereof shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, unless prohibited by applicable law.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">Class Action Waivers</h3>
                    <p className="text-sm text-slate-600 mb-2">
                      Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, or the waiver of class actions. To the extent permitted by applicable law, we disclaim all warranties and limit our liability to the maximum extent permitted by law.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-center text-slate-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <div className="flex justify-center mt-4">
                <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5">
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
