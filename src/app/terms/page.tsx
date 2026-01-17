'use client'

import PublicHeader from '@/components/public-header'
import PublicFooter from '@/components/public-footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader title="Terms" />

      <main className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
            Terms of Service
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl mb-12">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using the CareerToDo Platform, you accept and agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these Terms of Service, please do not access or use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Platform Overview</h2>
              <p className="text-muted-foreground">
                The CareerToDo Platform is a governed ecosystem that transforms education outcomes by validating real work done in real organizations. Through immutable records, multi-dimensional reputation, and transparent verification, we create a marketplace of proven talent and trusted ventures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground">
                To access certain features of the Platform, you must create a user account. You are responsible for maintaining the confidentiality and security of your account information and for all activities that occur under your account.
              </p>
              <p className="text-muted-foreground">
                You must provide accurate, current, and complete information when creating or updating your account. You agree to update your information promptly if any information changes.
              </p>
              <p className="text-muted-foreground">
                You may not share your account credentials with any third party or allow anyone else to access your account without our prior written consent.
              </p>
              <p className="text-muted-foreground">
                You are responsible for all activities that occur under your account, whether authorized or unauthorized. You agree to notify us immediately of any unauthorized use of your account or any other security breach.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use Policy</h2>
              <p className="text-muted-foreground">
                You agree to use the Platform only for legitimate purposes and in accordance with these Terms of Service. You may not use the Platform to:
              </p>
              <ul className="list-disc space-y-2 ml-6 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon or violate the intellectual property rights of others</li>
                <li>Upload, post, transmit, or otherwise make available any content that is illegal, harmful, threatening, abusive, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Upload, post, transmit, or otherwise make available any content that infringes upon or violates the intellectual property rights of others</li>
                <li>Upload, post, transmit, or otherwise make available any content that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
                <li>Engage in any conduct that restricts or inhibits any other user from using or enjoying the Platform</li>
                <li>Use the Platform to collect or harvest personal information about other users without their explicit consent</li>
                <li>Use automated scripts or bots to access the Platform</li>
                <li>Interfere with or disrupt the Platform or servers or networks connected to the Platform</li>
                <li>Attempt to gain unauthorized access to the Platform or any portion thereof</li>
                <li>Use the Platform for any fraudulent or deceptive purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content and materials on the Platform, including but not limited to text, graphics, logos, images, software, and code, are owned by the CareerToDo Platform or its licensors and are protected by intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not copy, modify, reproduce, distribute, display, perform, publish, license, create derivative works from, transmit, or otherwise use any content from the Platform without our prior written consent.
              </p>
              <p className="text-muted-foreground">
                You may not use the Platform to solicit or collect any content from other users without their explicit consent.
              </p>
              <p className="text-muted-foreground">
                All rights not expressly granted to you in these Terms of Service are reserved by the CareerToDo Platform and its licensors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Privacy and Data Protection</h2>
              <p className="text-muted-foreground">
                Your privacy is important to us. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your personal information.
              </p>
              <p className="text-muted-foreground">
                By using the Platform, you consent to the collection, use, and processing of your personal information as described in our Privacy Policy.
              </p>
              <p className="text-muted-foreground">
                You acknowledge that any information you provide on the Platform may be processed, stored, and transmitted in various locations and that we take reasonable measures to protect such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Disclaimers and Limitations of Liability</h2>
              <p className="text-muted-foreground">
                The Platform is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
              </p>
              <p className="text-muted-foreground">
                We do not warrant that the Platform will be uninterrupted, secure, or error-free, or that defects will be corrected.
              </p>
              <p className="text-muted-foreground">
                We do not warrant that results obtained from the use of the Platform will be accurate or reliable, or that the quality of any products, services, or information obtained through the Platform will meet your expectations.
              </p>
              <p className="text-muted-foreground">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
              </p>
              <p className="text-muted-foreground">
                In no event shall our total liability to you for all claims exceed the amount paid by you, if any, for accessing the Platform.
              </p>
              <p className="text-muted-foreground">
                Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitation may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify, defend, and hold harmless the CareerToDo Platform and its officers, directors, employees, agents, contractors, licensors, suppliers, and affiliates from and against any and all claims, demands, losses, liabilities, costs, and expenses arising out of or related to your use of the Platform or your violation of these Terms of Service.
              </p>
              <p className="text-muted-foreground">
                This indemnification obligation shall survive termination of these Terms of Service and your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account and access to the Platform at any time, without prior notice, for any reason, including but not limited to breach of these Terms of Service.
              </p>
              <p className="text-muted-foreground">
                Upon termination, your right to use the Platform will immediately cease. We may also delete or deactivate your account and all related data.
              </p>
              <p className="text-muted-foreground">
                We shall not be liable to you or any third party for any termination of your account or access to the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Governing Law and Dispute Resolution</h2>
              <p className="text-muted-foreground">
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which the CareerToDo Platform is established.
              </p>
              <p className="text-muted-foreground">
                Any disputes arising out of or related to these Terms of Service or your use of the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
              <p className="text-muted-foreground">
                By using the Platform, you waive any right to a trial by jury or to participate in any class action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Service at any time, without prior notice, by posting revised Terms on the Platform.
              </p>
              <p className="text-muted-foreground">
                Your continued use of the Platform after any such modifications constitutes your acceptance of the revised Terms of Service.
              </p>
              <p className="text-muted-foreground">
                It is your responsibility to review these Terms of Service periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <div className="prose max-w-none text-muted-foreground space-y-4">
                <p>If you have any questions about these Terms of Service, please contact us at:</p>
                <p>Email: <a href="mailto:support@CareerToDo.com" className="text-primary hover:underline">support@CareerToDo.com</a></p>
                <p>We will make reasonable efforts to respond to your inquiries in a timely manner.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. General Provisions</h2>
              <p className="text-muted-foreground">
                These Terms of Service constitute the entire agreement between you and the CareerToDo Platform regarding your use of the Platform and supersede any prior agreements between you and the CareerToDo Platform regarding the subject matter hereof.
              </p>
              <p className="text-muted-foreground">
                If any provision of these Terms of Service is found to be invalid or unenforceable by a court of competent jurisdiction, such provision shall be deemed severable from the remaining Terms of Service, and the remaining Terms of Service shall continue in full force and effect.
              </p>
              <p className="text-muted-foreground">
                Our failure to enforce any right or provision of these Terms of Service shall not be deemed a waiver of such right or provision.
              </p>
              <p className="text-muted-foreground">
                Any waiver of any breach of these Terms of Service shall not be deemed a waiver of any subsequent breach.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-center text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <div className="flex justify-center mt-4">
                <a href="/" className="text-sm text-muted-foreground hover:underline">
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
