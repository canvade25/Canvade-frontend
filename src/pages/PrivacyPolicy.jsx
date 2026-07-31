import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [tableOfContentOpen, setTableOfContentOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white font-inter">
      <Navbar />

      <main className="flex-grow pt-20 sm:pt-24 md:pt-28 pb-16 px-3 sm:px-4 md:px-8 lg:px-12 select-none text-left">
        <div className="max-w-[1700px] mx-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-400 rounded-sm shrink-0" />
              <h1 className="text-2xl sm:text-[28px] font-black text-[#00684a] tracking-tight leading-none">
                Privacy Policy
              </h1>
            </div>

            <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setTableOfContentOpen(!tableOfContentOpen)}
                  className="bg-white border border-slate-200 text-slate-400 text-[12px] font-medium px-4 py-2 rounded-xl shadow-3xs flex items-center gap-3 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span>Select from table of content</span>
                  <span className="text-[9px] opacity-60">▼</span>
                </button>
                {tableOfContentOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-xl p-1.5 z-30 text-[12px] font-medium text-slate-700">
                    <a href="#user-structure" className="block px-3 py-2 rounded-lg hover:bg-slate-50">User Structure</a>
                    <a href="#student-data" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Student Data Collection</a>
                    <a href="#educator-data" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Educator Data Collection</a>
                    <a href="#content-storage" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Content Storage & Media</a>
                    <a href="#payments-data" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Payments & Transactions</a>
                  </div>
                )}
              </div>
              <span className="text-[12px] font-medium text-slate-700 italic whitespace-nowrap">
                Effective from 1st July'26
              </span>
            </div>
          </div>

          <section id="user-structure" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              User Structure
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade operates as a two-sided education marketplace with clearly defined user roles to ensure clarity, accountability, and platform efficiency.
            </p>
            
            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">The platform includes the following user types:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><span className="font-semibold text-slate-800">Students</span> – individuals who use the platform to discover, compare, and enroll in courses</li>
                <li><span className="font-semibold text-slate-800">Educators</span> – institutions such as institutes, colleges, schools, and universities that list and manage their courses</li>
              </ul>
            </div>
            
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700 mt-1">
              For the purpose of this platform, the term "Educator" collectively refers to all types of educational providers, including institutions, institutes, colleges, schools, and universities.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-3">
              <p className="font-bold text-slate-800 tracking-tight">Account Structure:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Each Educator is allowed to create and operate one account per entity</li>
                <li>If an Educator operates multiple branches, each branch may create and manage its own separate account</li>
                <li>All Educator accounts are treated as independent entities, even if they belong to the same organization</li>
              </ul>
            </div>

            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700 mt-1">
              This structure ensures operational independence, clear ownership of listings, and accountability for the information and services provided by each Educator.
            </p>
          </section>

          <section id="student-data" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Student Data Collection
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              We collect certain information from students to enable account creation, personalize course discovery, and facilitate interactions with Educators.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Information provided directly by students includes:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Full name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Account credentials (such as password)</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Optional or contextual information may include:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>General location (such as city)</li>
                <li>Education-related details (such as interests, course preferences, or academic level)</li>
              </ul>
            </div>

            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700 mt-2">
              Students may browse and explore courses on Canvade without creating an account. However, actions such as contacting Educators, saving preferences, enrolling in courses, or making payments require account registration.
            </p>
          </section>

          <section id="educator-data" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Educator Data Collection
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              We collect information from Educators to enable course listings, ensure platform integrity, and facilitate interactions with students.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Information provided by Educators includes:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Institution or organization name</li>
                <li>Owner or authorized representative name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Physical address</li>
                <li>Course details (such as descriptions, curriculum, schedules)</li>
                <li>Pricing and fee structures</li>
                <li>Media content (such as images, thumbnails, and videos)</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Verification Information:</p>
              <p className="text-slate-500 leading-relaxed">
                To maintain trust and authenticity on the platform, Educators are required to submit certain official documents during registration. These documents are used to verify that the Educator is a legally recognized entity.
              </p>
              <p className="text-slate-500 leading-relaxed">
                While registration is self-initiated, Canvade may review submitted information and documentation to validate legitimacy. However, such verification does n
              </p>
            </div>
          </section>

          <section id="content-storage" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Content Storage and Media Handling
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade follows a lightweight content storage model designed to optimize performance, reduce infrastructure dependency, and maintain clear ownership boundaries between the platform and Educators.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">At present, Canvade stores:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Course metadata (such as titles, descriptions, pricing, and schedules)</li>
                <li>Thumbnails and images uploaded for listings</li>
                <li>Limited media content uploaded directly to the platform</li>
              </ul>
            </div>

            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700 mt-1">
              Canvade does not function as a primary content hosting provider for full course delivery. Educational content, including lectures or recordings, may be managed and delivered by Educators through their own systems or third-party infrastructure.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">This model ensures that:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Educators retain control and responsibility over their educational content</li>
                <li>The platform operates primarily as a discovery, listing, and facilitation layer</li>
              </ul>
            </div>
          </section>

          <section id="payments-data" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Payments and Transaction Data
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade facilitates payments between students and Educators through integrated third-party payment gateways. The platform acts as an intermediary to enhance transaction security, reduce fraud risk, and ensure a reliable payment experience for students.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Payment Flow:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Payments are made by students directly through the Canvade platform</li>
                <li>Transactions are processed via secure third-party payment gateways (such as Razorpay)</li>
                <li>Canvade collects the payment and subsequently transfers the applicable amount to the respective Educator</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">This model is implemented to:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Provide students with a safer and more controlled payment environment</li>
                <li>Reduce the risk of scams or misleading transactions</li>
                <li>Maintain a record of verified transactions on the platform</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Data We Store:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Transaction history (such as course purchased, amount, and date)</li>
                <li>Payment status (such as successful, failed, or pending transactions)</li>
              </ul>
            </div>

            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700 mt-2">
              Canvade does not store sensitive financial information such as full card details. Such data is securely handled by the payment gateway providers in accordance with their own compliance standards.
            </p>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Communication and Interaction
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade provides an integrated communication system to enable direct interaction between students and Educators within the platform.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Supported Communication Channel:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>In-platform chat functionality between students and Educators</li>
              </ul>
              <p className="text-slate-500 mt-1">All official communication related to inquiries, course details, or clarifications is intended to occur through this internal chat system.</p>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Data Handling:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Messages exchanged within the platform may be stored and processed</li>
                <li>
                  <span className="font-semibold text-slate-800">Communication data may be used for -</span>
                  <ul className="list-disc pl-5 mt-1.5 space-y-1.5 text-slate-700">
                    <li>Enabling conversation continuity</li>
                    <li>Monitoring misuse, fraud, or policy violations</li>
                    <li>Resolving disputes, if required</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">External Communication:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Canvade does not support or manage communication conducted outside the platform (such as WhatsApp, phone calls, or other channels)</li>
                <li>Any interaction outside the platform is not tracked, verified, or considered valid for dispute resolution or support purposes</li>
              </ul>
              <p className="text-slate-500 mt-1">Users are encouraged to communicate within the platform to ensure transparency, security, and proper record-keeping.</p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Data Sharing and Disclosure
            </h2>
            
            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">We may share user information in the following cases:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>With Educators: when students interact, inquire, or enroll in courses</li>
                <li>With Service Providers: including payment gateways, hosting providers, and infrastructure services</li>
                <li>For Legal Compliance: if required by law, regulation, or legal process</li>
                <li>Business Transfers: in case of merger, acquisition, or restructuring</li>
              </ul>
            </div>

            <p className="text-[13.5px] font-medium text-slate-700 mt-1">
              We do not sell personal data to third parties.
            </p>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Platform Integrity, Verification, and Risk Handling
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade is designed to maintain a trustworthy and transparent marketplace. While we implement verification and monitoring mechanisms, certain risks are inherent in a marketplace model.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Educator Verification:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Educators are required to submit official documents during registration to establish legal authenticity</li>
                <li>Verification is conducted to the extent reasonably possible at the time of onboarding</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Ongoing Monitoring and Enforcement:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Educators may be subject to re-verification if:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1.5 text-slate-700">
                    <li>Reported by students</li>
                    <li>Suspected of providing misleading or inaccurate information</li>
                  </ul>
                </li>
                <li>Based on review outcomes, Canvade may:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1.5 text-slate-700">
                    <li>Issue warnings</li>
                    <li>Restrict certain functionalities</li>
                    <li>Suspend or permanently remove the Educator account</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Accuracy of Information:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Educators are responsible for ensuring that all course-related information provided on the platform is accurate and not misleading</li>
                <li>Any claims related to courses must be clearly stated within the official course details listed on the platform</li>
              </ul>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Off-Platform Dealings and Liability
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[13.5px] font-medium text-slate-700">
              <li>Canvade operates as a controlled platform environment to ensure user safety and transaction integrity</li>
              <li>Users are strongly advised to conduct all interactions and payments within the platform</li>
            </ul>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Important:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Any dealings conducted outside the platform are:</li>
                <li>Not monitored or verified by Canvade</li>
                <li>Not eligible for support, dispute resolution, or protection</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Canvade shall not be held liable for:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Scams</li>
                <li>Misrepresentation</li>
                <li>Financial or service-related issues</li>
              </ul>
              <p className="text-slate-500 mt-1">arising from interactions or transactions conducted outside the platform.</p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Refunds and Disputes
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[13.5px] font-medium text-slate-700">
              <li>Refund requests may arise and are handled based on specific terms and conditions defined by the platform and/or the Educator</li>
              <li>Canvade may facilitate dispute resolution where applicable, but outcomes depend on the stated policies governing the transaction</li>
            </ul>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              User Rights and Controls
            </h2>
            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Users may:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Access and review their personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of their account and associated data</li>
                <li>Manage communication preferences</li>
              </ul>
              <p className="text-slate-500 mt-1">Requests may be submitted through platform support channels.</p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Data Retention
            </h2>
            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">We retain user data:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>As long as the account remains active</li>
                <li>As necessary to fulfill legal, financial, and operational obligations</li>
              </ul>
              <p className="font-bold text-slate-800 mt-2">Certain data may be retained after account deletion for:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Fraud prevention</li>
                <li>Dispute resolution</li>
                <li>Legal compliance</li>
              </ul>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-6">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Changes to This Privacy Policy
            </h2>
            <ul className="list-disc pl-5 text-[13.5px] font-medium text-slate-700 space-y-2">
              <li>We may update this Privacy Policy from time to time.</li>
              <li>Users will be notified of significant changes through the platform or via email. Continued use of the platform constitutes acceptance of the updated policy.</li>
            </ul>
          </section>

          <div className="w-full flex justify-center items-center gap-1.5 text-[12px] font-semibold text-slate-700 mb-10 shrink-0">
            <button type="button" disabled className="w-7 h-7 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 opacity-40 cursor-not-allowed">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#00684a] text-white text-[11px] font-bold shadow-3xs">
              1
            </button>
            <button type="button" disabled className="w-7 h-7 border border-slate-200 rounded-lg flex items-center justify-center bg-slate-50 opacity-40 cursor-not-allowed">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full bg-transparent p-1 flex flex-col gap-3 text-left">
            <h2 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-none">
              Contact Us
            </h2>
            <p className="text-[13.5px] font-medium text-slate-700">
              For questions, concerns, or data-related requests:
            </p>
            <div className="flex flex-col gap-1 text-[13.5px] font-bold text-slate-800 mt-2">
              <p>Email us: <span className="font-normal text-slate-700 select-text">Support@canvade.com</span></p>
              <p>Phone no: <span className="font-normal text-slate-700 select-text">+91 89208 45599</span></p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;