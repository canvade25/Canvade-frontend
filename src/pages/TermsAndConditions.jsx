import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import { ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

const TermsAndConditions = () => {
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
                Terms & Conditions
              </h1>
            </div>

            <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setTableOfContentOpen(!tableOfContentOpen)}
                  className="bg-white border border-slate-200 text-slate-500 text-[12px] font-medium px-4 py-2 rounded-xl shadow-3xs flex items-center gap-3 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span>Select from table of content</span>
                  <span className="text-[9px] opacity-60">▼</span>
                </button>
                {tableOfContentOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-xl p-1.5 z-30 text-[12px] font-medium text-slate-700">
                    <a href="#clips" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Must watch clips</a>
                    <a href="#platform-role" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Platform Role</a>
                    <a href="#dispute" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Dispute Handling</a>
                    <a href="#obligations" className="block px-3 py-2 rounded-lg hover:bg-slate-50">User Obligations</a>
                    <a href="#payments" className="block px-3 py-2 rounded-lg hover:bg-slate-50">Payments Framework</a>
                  </div>
                )}
              </div>
              <span className="text-[12px] font-medium text-slate-700 italic whitespace-nowrap">
                Effective from 1st July'26
              </span>
            </div>
          </div>

          <section id="clips" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Must watch clips for Educator
            </h2>
            <p className="text-[13.5px] font-medium text-slate-500">
              3 important topics a educator should know before Joining the Canvade
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-4">
              {[
                { title: "Maintain Transparency", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80" },
                { title: "Enrollment through Canvade", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80" },
                { title: "Avoid Scams Choose Smart", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80" }
              ].map((video, idx) => (
                <div key={idx} className="group cursor-pointer flex flex-col items-center">
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] w-full max-w-[220px] mb-3 shadow-sm border border-slate-100">
                    <img src={video.img} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/35 transition-all">
                      <PlayCircle className="text-white/90 w-12 h-12 stroke-[1.5]" />
                    </div>
                  </div>
                  <p className="text-[12.5px] font-semibold text-slate-700 mt-1">{video.title}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="platform-role" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Platform Role in Transactions
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade operates as a facilitated marketplace with controlled payment flow, designed to improve transaction safety while maintaining clear boundaries of responsibility between the platform and Educators.
            </p>
            <ul className="list-disc pl-5 text-[13.5px] font-medium text-slate-700 space-y-2">
              <li>Canvade enables students to discover, compare, and enroll in courses offered by independent Educators</li>
              <li>Payments are made through the platform and are temporarily held before being transferred to the Educator</li>
              <li>Before releasing payment, Canvade may conduct a confirmation check with the student to validate the transaction and reduce disputes</li>
            </ul>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Purpose of this model:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Minimize scams and misleading enrollments</li>
                <li>Ensure pricing transparency (no hidden charges beyond listed details)</li>
                <li>Add a layer of trust and verification in transactions</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Important Positioning:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Canvade facilitates and safeguards transactions, but does not act as the provider of educational services</li>
                <li>The responsibility for course delivery, quality, and outcomes remains with the respective Educator</li>
              </ul>
            </div>
          </section>

          <section id="dispute" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Responsibility and Dispute Handling
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade maintains a structured approach to handling complaints while clearly defining the boundaries of responsibility between the platform and Educators.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Course Quality and Expectations:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Students are expected to review all available course information, including curriculum, media, and descriptions, before enrolling</li>
                <li>Educators are solely responsible for the quality, delivery, and accuracy of their courses</li>
                <li>Canvade does not guarantee course outcomes, learning results, or satisfaction</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Educator Accountability:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>If an Educator fails to deliver services as described, responsibility lies entirely with the Educator</li>
                <li>Repeated or validated complaints may trigger internal review processes</li>
                <li>Based on findings, Canvade may take actions including warnings, restrictions, or suspension of the Educator account</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2 pt-3 border-t border-slate-100">
              <p className="font-bold text-slate-800">Platform Role in Disputes:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Canvade may review complaints and facilitate resolution where appropriate</li>
                <li>Transaction settlements may be subject to internal verification processes aligned with platform safeguards and user protection measures</li>
              </ul>
              <p className="text-[13.5px] font-medium text-slate-700 mt-1 italic ">
                This framework is designed to balance user protection with the independent nature of Educators operating on the platform.
              </p>
            </div>
          </section>

          <section id="obligations" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              User Obligations and Acceptable Use
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              All users of Canvade are required to adhere to defined standards of conduct to ensure platform integrity, user safety, and fair marketplace operations.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">General Obligations (Applicable to All Users):</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Users must provide accurate, complete, and up-to-date information during registration and usage</li>
                <li>Users must not engage in fraudulent, deceptive, or abusive activities on the platform</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Student Responsibilities:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Students must complete payments through the Canvade platform only</li>
                <li>Any attempt to bypass the platform for payments will:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-500">
                    <li>Void platform protection</li>
                    <li>Remove eligibility for support, dispute resolution, or assistance from Canvade</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Educator Responsibilities:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Educators must ensure that all course-related content is accurate, transparent, and not misleading</li>
                <li>Any false claims, misrepresentation, or misleading information may result in:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-500">
                    <li>Account suspension</li>
                    <li>Platform restrictions</li>
                    <li>Legal action where applicable</li>
                  </ul>
                </li>
                <li>Educators must not:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-500">
                    <li>Encourage or enforce students to bypass the platform's payment system</li>
                    <li>Redirect transactions outside the platform</li>
                  </ul>
                </li>
              </ul>
            </div>

            <p className="text-[13px] font-medium text-slate-500 italic pt-2">
              Violation of these obligations may lead to strict enforcement actions, including suspension, termination, or further investigation.
            </p>
          </section>

          <section id="payments" className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Payments, Fees, and Refund Framework
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade defines a structured payment and fee model to ensure transparency while maintaining flexibility for dispute handling.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Platform Fees:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Canvade does not charge a fixed subscription fee to Educators</li>
                <li>Charges may apply:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-500">
                    <li>On a per-enrollment basis</li>
                    <li>For optional promotional features used by Educators</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Payment Handling:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>All payments must be completed through the Canvade platform</li>
                <li>Canvade facilitates the transaction and processes payments via integrated payment gateways</li>
              </ul>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Refunds and Financial Responsibility
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Refunds are handled on a case-by-case basis, depending on the nature of the issue and the circumstances involved.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">General Principles:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>If a student voluntarily leaves or discontinues a course, the payment is typically non-refundable</li>
                <li>In cases of disputes arising from factors outside Canvade's control, the Educator holds primary responsibility</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Time-Based Limitation:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Refund-related claims are generally expected to be raised within a reasonable evaluation period after enrollment</li>
                <li>Claims raised beyond this period may not be eligible for review or resolution by Canvade</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Exception Handling:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>In rare cases involving:
                  <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-500">
                    <li>Hidden charges</li>
                    <li>Misrepresentation not disclosed on the platform</li>
                  </ul>
                </li>
              </ul>
              <p className="text-[13.5px] font-medium text-slate-700 mt-1">
                Canvade may review and take appropriate action based on internal assessment.
              </p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Account Suspension and Termination
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade enforces a structured moderation and enforcement framework to maintain platform integrity, user safety, and compliance with these Terms.
            </p>
            <p className="text-[13.5px] font-medium text-slate-700">
              Actions may be taken based on the severity and nature of the violation, including warnings, restrictions, suspension, or permanent termination of accounts.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-1">
              <p className="font-bold text-slate-800">Immediate Suspension (High-Severity Violations):</p>
              <p className="text-slate-500 font-medium">Accounts may be suspended or terminated without prior notice in cases such as:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Fraudulent activities or intentional deception</li>
                <li>Bypassing or attempting to bypass the platform's payment system</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-3">
              <p className="font-bold text-slate-800">Warning-Based Enforcement (Moderate Violations):</p>
              <p className="text-slate-500 font-medium">Certain violations may initially result in a warning, followed by stricter action if not resolved:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <span className="font-semibold text-slate-800">Misleading Content:</span>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-500">
                    <li>Initial warning may be issued</li>
                    <li>Continued violation may lead to suspension or removal of listings</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold text-slate-800">Repeated Complaints:</span>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-500">
                    <li>Patterns of consistent negative or verified complaints may trigger review</li>
                    <li>Escalation may lead to account suspension or restrictions</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-3">
              <p className="font-bold text-slate-800">Additional Enforcement Measures:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Content removal or listing restrictions</li>
                <li>Temporary or permanent access limitations</li>
                <li>Investigation and verification processes</li>
              </ul>
              <p className="text-[13.5px] font-medium text-slate-700 mt-1">
                Canvade reserves the right to take action at its sole discretion based on internal review, user reports, and platform policies.
              </p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Intellectual Property and Content Rights
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade maintains a clear distinction between platform-owned assets and Educator-provided content.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Educator Content Ownership:</p>
              <p className="text-slate-500">Educators retain full ownership of all content they upload, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Course materials</li>
                <li>Images, videos, and descriptions</li>
                <li>Branding and institutional information</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">License Granted to Canvade:</p>
              <p className="text-slate-500">By uploading content to the platform, Educators grant Canvade a non-exclusive, worldwide, royalty-free license to:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Display and publish content on the platform</li>
                <li>Use content for marketing, promotional, and discovery purposes</li>
                <li>Optimize and distribute listings across platform channels</li>
              </ul>
              <p className="text-[13.5px] font-medium text-slate-500 mt-1 italic">
                This license is limited to purposes related to operating and promoting the platform.
              </p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Limitation of Liability
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade provides a technology platform that facilitates discovery, interaction, and transactions between students and Educators. While we implement safeguards and review mechanisms, certain responsibilities remain with the respective Educators.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Platform Scope:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Canvade does not guarantee the overall quality, effectiveness, or outcomes of any course</li>
                <li>Any specific claims explicitly stated on a course listing are the responsibility of the respective Educator</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Claims and Representation:</p>
              <p className="text-slate-500">If an Educator makes specific claims on their course page, such claims are subject to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Student review and reporting</li>
                <li>Platform-level verification and action where necessary</li>
              </ul>
              <p className="text-slate-500 mt-1">
                Canvade may review and take corrective action in cases of misrepresentation, but does not independently validate all claims at all times
              </p>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Responsibility Boundaries:</p>
              <p className="text-slate-500">Educators are responsible for:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Course delivery</li>
                <li>Accuracy of information</li>
                <li>Fulfillment of commitments stated on their listings</li>
              </ul>
              <p className="text-slate-500 mt-1">Canvade may:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Facilitate dispute review</li>
                <li>Take enforcement actions (including suspension or restrictions)</li>
              </ul>
              <p className=" italic text-[13px] text-slate-500">but does not act as the primary service provider.</p>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Financial and Transactional Limitations:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Canvade's involvement in financial matters is limited to platform-facilitated transactions and related safeguards</li>
                <li>Any liability, where applicable, is subject to:
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-500">
                    <li>Defined platform policies</li>
                    <li>Applicable timeframes for raising concerns or disputes</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Governing Law and Jurisdiction
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              These Terms and Conditions shall be governed by and interpreted in accordance with the laws of India.
            </p>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700">
              <p className="font-bold text-slate-800">Jurisdiction:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>All disputes, claims, or legal proceedings arising out of or related to the use of Canvade shall fall under the exclusive jurisdiction of the courts located in New Delhi</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Operational Scope:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Canvade currently operates primarily within India and is intended for use by students located in India</li>
                <li>The platform may allow Educators from outside India to create and manage listings, subject to applicable platform policies and restrictions</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2">
              <p className="font-bold text-slate-800">Cross-Border Consideration:</p>
              <p className="text-slate-500">Educators operating from outside India are responsible for complying with:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Their local laws and regulations</li>
                <li>Any applicable Indian laws relevant to their participation on the platform</li>
              </ul>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-5">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-none">
              Changes to Terms
            </h2>
            <p className="text-[13.5px] font-medium leading-relaxed text-slate-700">
              Canvade reserves the right to modify or update these Terms and Conditions at any time to reflect changes in the platform, legal requirements, or business operations.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[13.5px] font-medium text-slate-700">
              <li>Updated Terms will be published on the platform with a revised "Effective Date"</li>
              <li>In case of significant changes, users may be notified through the platform or via registered contact details</li>
            </ul>

            <div className="flex flex-col gap-2 text-[13.5px] font-medium text-slate-700 mt-2 pt-3 border-t border-slate-100">
              <p className="font-bold text-slate-800">User Responsibility:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Users are encouraged to review the Terms periodically</li>
                <li>Continued use of the platform after changes come into effect constitutes acceptance of the updated Terms</li>
              </ul>
              <p className="text-[13.5px] font-medium text-slate-700 mt-1">
                If a user does not agree with the revised Terms, they must discontinue use of the platform.
              </p>
            </div>
          </section>

          <section className="w-full bg-white rounded-[30px] border border-gray-100 shadow-sm p-5 sm:p-6 md:p-10 flex flex-col gap-4 text-slate-700 mb-6">
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

export default TermsAndConditions;