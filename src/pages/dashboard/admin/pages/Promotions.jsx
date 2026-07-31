import React, { useEffect, useState } from "react";
import {
  Send,
  Crown,
  Eye,
  Calendar,
  BookOpen,
  Check,
  Star,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Percent,
  Users,
  HelpCircle,
  Wallet,
  Loader2,
} from "lucide-react";
import { useMyPlan } from "../../../../hooks/useMyPlan";
import { createPlanOrder, verifyPlanPayment } from "../../../../../api/planApi";
import { showError, showSuccess } from "../../../../utils/toast";

const comparisonFeatures = [
  {
    id: 1,
    name: "Visibility",
    desc: "Improve your institute discoverability",
    free: "Basic",
    pro: "3x More visibility",
    info: "Reach more students across Canvade.",
    icon: Eye,
    color: "text-teal-500 bg-teal-50 border-teal-100",
  },
  // {
  //   id: 2,
  //   name: "Workshops Listing",
  //   desc: "Organize workshops",
  //   free: "1 per month",
  //   pro: "20 per month",
  //   info: "Create up to 20 workshops monthly.",
  //   icon: Calendar,
  //   color: "text-orange-500 bg-orange-50 border-orange-100",
  // },
  {
    id: 3,
    name: "Course Listing",
    desc: "List your courses on Canvade",
    free: "7 Active primary Courses",
    pro: "Unlock unlimited Courses",
    info: "List unlimited active courses Along with 7 primary Courses.",
    icon: BookOpen,
    color: "text-purple-500 bg-purple-50 border-purple-100",
  },
  {
    id: 4,
    name: "Reviews & Ratings",
    desc: "Manage reviews and build trust",
    free: "View Only",
    pro: "View and Interact",
    info: "Reply and chat with students for reviews and feedback.",
    icon: Star,
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
  {
    id: 5,
    name: "Updates",
    desc: "Share updates and announcements",
    free: "2 Per Month",
    pro: "30 Per Month",
    info: "Share regular news and announcements.",
    icon: FileText,
    color: "text-blue-500 bg-blue-50 border-blue-100",
  },
  {
    id: 6,
    name: "Profile Verification",
    desc: "Show authenticity and trust",
    free: "Regular Profile",
    pro: "Eligible for Tags and Trust badges",
    info: "Tags & Badges Displayed on your profile and courses to build trust, improve credibility, and stand out from competitors.",
    icon: ShieldCheck,
    color: "text-green-500 bg-green-50 border-green-100",
  },
  {
    id: 7,
    name: "Enrollment Charges",
    desc: "Platform enrolment fee and charges",
    free: "8%",
    pro: "5%",
    info: "Lower enrollment charges apply only to student enrollments made while the institution's Growth Plan subscription is active.",
    icon: Percent,
    color: "text-orange-400 bg-orange-50 border-orange-100",
  },
  {
    id: 8,
    name: "Visitor Details",
    desc: "Know your visitors better",
    free: "Enquiry only",
    pro: "View Leads details",
    info: "Access details of interested students who viewed your profile and courses.",
    icon: Users,
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
  },
  {
    id: 9,
    name: "Support",
    desc: "Get help whenever you need",
    free: "Regular Support",
    pro: "Priority Support",
    info: "Receive faster assistance from our team.",
    icon: HelpCircle,
    color: "text-sky-500 bg-sky-50 border-sky-100",
  },
  {
    id: 10,
    name: "Payment Settlement",
    desc: "Withdrawal settlement time",
    free: "30 - 50 days",
    pro: "20 - 30 days",
    info: "Receive faster payouts within 20-30 working days.",
    icon: Wallet,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
];

const BILLING_CYCLES = {
  monthly: { label: "Monthly", pricePerMonth: 1200, totalPerCycle: 1200 },
  annual: { label: "Annually", pricePerMonth: 999, totalPerCycle: 999 * 12 },
};

const Promotions = () => {
  const { plan, loading, refresh } = useMyPlan();
  const isPro = plan?.tier === "pro";
  const [billingCycle, setBillingCycle] = useState("annual");
  // Once we know the subscriber's current cycle, default the toggle to it
  // (still changeable, e.g. to switch cycles on renewal).
  useEffect(() => {
    if (plan?.billingCycle && BILLING_CYCLES[plan.billingCycle]) {
      setBillingCycle(plan.billingCycle);
    }
  }, [plan?.billingCycle]);
  const cyclePricing = BILLING_CYCLES[billingCycle];

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleUpgrade = async () => {
    try {
      const orderRes = await createPlanOrder(billingCycle);
      if (!orderRes.success) {
        showError(orderRes.message || "Unable to start upgrade");
        return;
      }
      const { orderId, amount, currency, key } = orderRes.data;

      const options = {
        key,
        amount,
        currency,
        order_id: orderId,
        name: "Canvade",
        description: `Institute Growth Plan — ${BILLING_CYCLES[billingCycle].label}`,
        theme: { color: "#1fa485" },
        handler: async (response) => {
          try {
            const verifyRes = await verifyPlanPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.success) {
              showSuccess("You're now on the Growth Plan!");
              refresh();
            } else {
              showError(verifyRes.message || "Payment verification failed");
            }
          } catch (err) {
            showError(
              err?.response?.data?.message || "Payment verification failed",
            );
          }
        },
        modal: {
          ondismiss: () => console.log("Payment cancelled"),
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      showError(err?.response?.data?.message || "Unable to start upgrade");
    }
  };

  return (
    <div className="w-full bg-slate-50/30  min-h-screen pb-16 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-stretch">
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px] relative text-left">
          <div className="flex flex-row items-start gap-4 w-full">
            <div className="w-16 h-16 rounded-full bg-[#eefbf7] flex items-center justify-center shrink-0">
              <Send className="w-7 h-7 text-[#1fa485] transform rotate-[-12deg]" />
            </div>

            <div className="flex-1 flex flex-col items-start">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                Free Plan
              </h3>
              <p className="text-xs font-medium text-slate-800 mt-0.5">
                Start free and build your presence
              </p>

              <div className="mt-3 mb-4 flex items-baseline gap-1">
                <span className="text-[34px] font-bold text-slate-900 leading-none">
                  ₹0
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  / month
                </span>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 pl-0.5 mb-5">
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>Perfect for getting started</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>Basic visibility & essential tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>Ideal for small institutes</span>
                </div>
              </div>

              {/* <button className="w-full sm:w-max min-w-[250px] border-2 border-[#1fa485]/80 hover:bg-emerald-50 text-[#1fa485] font-bold py-2 px-6 rounded-lg text-xs transition-all shadow-sm text-center">
                Get Started Free
              </button> */}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border-2 border-[#1fa485] shadow-sm flex flex-col justify-between min-h-[220px] relative text-left">
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
            <span className="bg-[#1fa485] text-white text-[10px] font-black tracking-wider uppercase px-4 py-1 rounded-lg shadow-sm">
              {isPro ? "Your Plan" : "Most Popular"}
            </span>
          </div>

          <div className="flex flex-row items-start gap-4 w-full mt-1">
            <div className="w-16 h-16 rounded-full bg-[#eefbf7] flex items-center justify-center shrink-0">
              <Crown className="w-7 h-7 text-[#1fa485]" />
            </div>

            <div className="flex-1 flex flex-col items-start">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                Growth Plan
              </h3>
              <p className="text-xs font-medium text-slate-800 mt-0.5">
                Grow faster with premium benefits
              </p>

              <div className="mt-2 mb-1 inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-bold">
                {Object.entries(BILLING_CYCLES).map(([key, cycle]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBillingCycle(key)}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      billingCycle === key
                        ? "bg-white text-[#1fa485] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {cycle.label}
                    {key === "annual" && (
                      <span className="ml-1 text-emerald-600">
                        Save{" "}
                        {Math.round(
                          (1 -
                            BILLING_CYCLES.annual.pricePerMonth /
                              BILLING_CYCLES.monthly.pricePerMonth) *
                            100,
                        )}
                        %
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-3 mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-[34px] font-bold text-slate-900 leading-none">
                    ₹{cyclePricing.pricePerMonth}
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    / month
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-800 tracking-wide mt-0.5">
                  {billingCycle === "monthly"
                    ? "Billed monthly · renew anytime"
                    : `Billed ₹${cyclePricing.totalPerCycle.toLocaleString("en-IN")}/year · renews annually`}
                </p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-600 pl-0.5 mb-5">
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>
                    {billingCycle === "monthly"
                      ? "Flexible monthly billing, cancel anytime"
                      : "Best value — save vs. monthly billing"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>3X more visibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>Advanced tools & analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check
                    className="w-3.5 h-3.5 text-[#1fa485] shrink-0"
                    strokeWidth={3.5}
                  />
                  <span>Better leads & growth</span>
                </div>
              </div>

              {loading ? (
                <button
                  disabled
                  className="w-full sm:w-max min-w-[250px] border bg-slate-200 text-slate-500 font-bold py-2 px-6 rounded-lg text-xs shadow-sm text-center inline-flex items-center justify-center gap-2"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading plan...
                </button>
              ) : isPro ? (
                <div className="w-full flex flex-col items-start gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-600">
                    <Crown className="w-3.5 h-3.5" strokeWidth={2.5} />
                    You're on Pro
                  </span>
                  {plan?.expiresAt && (
                    <span className="text-[10px] font-semibold text-slate-600">
                      Valid until {formatDate(plan.expiresAt)}
                    </span>
                  )}
                  <button
                    onClick={handleUpgrade}
                    className="w-full sm:w-max min-w-[250px] border-2 border-[#1fa485]/80 hover:bg-emerald-50 text-[#1fa485] font-bold py-2 px-6 rounded-lg text-xs transition-all shadow-sm text-center"
                  >
                    Renew Plan
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleUpgrade}
                  className="w-full sm:w-max min-w-[250px] border bg-[#1fa485] hover:bg-[#198f73] text-white font-bold py-2 px-6 rounded-lg text-xs transition-all shadow-sm text-center"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-5 border border-slate-200 shadow-sm w-full space-y-3 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-1.5 pb-2">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            Plan Comparison
          </h2>
          <p className="text-[10px] font-semibold text-slate-800 tracking-wide">
            All plans include dashboard access and basic support
          </p>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
          <div className="min-w-[768px]">
            {" "}
            <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-300 items-center text-[13px] font-bold text-gray-700 tracking-tight select-none">
              {/* Features Section */}
              <div className="py-3.5 px-4 border-r border-gray-300 font-bold text-lg">
                Features
              </div>

              <div className="text-center py-3.5 px-4 border-r border-gray-300 font-bold text-lg">
                Free Plan
                <span className="block text-[10px] font-medium text-gray-700 mt-0.5">
                  ₹0
                </span>
              </div>

              <div className="relative overflow-hidden text-center py-3.5 px-4 bg-gradient-to-br from-emerald-50 via-white to-amber-50 font-bold shadow-[inset_0_3px_0_#1fa485]">
               
                <span className="inline-flex items-center justify-center gap-1 text-lg">
                  Growth Plan
                  <HelpCircle
                    className="h-3.5 w-3.5 text-slate-500"
                    title="See explanation for Growth Plan benefits"
                  />
                </span>
                <span className="block text-[10px] font-semibold text-emerald-800 mt-0.5">
                  ₹{cyclePricing.pricePerMonth} / month
                </span>
                 <span className="mb-1 inline-flex rounded-full bg-[#1fa485] px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
                  Recommended
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {comparisonFeatures.map((row) => {
                const FeatureIcon = row.icon;

                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-3 items-stretch transition-colors hover:bg-slate-50/30"
                  >
                    <div className="flex items-center gap-3 py-1.5 px-3 border-r border-slate-200">
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 mt-0.5 scale-90 ${row.color}`}
                      >
                        <FeatureIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 leading-tight">
                          {row.name}
                        </h4>
                        <p className="text-[9.5px] font-medium text-slate-600 leading-tight mt-0.5">
                          {row.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-center flex flex-col items-center justify-center py-1.5 px-2 border-r border-slate-200">
                      <span className="text-xs font-semibold text-slate-600">
                        {row.free}
                      </span>
                      {row.freeSub && (
                        <span className="text-[8.5px] font-bold text-[#1fa485] mt-0.5 bg-emerald-50 px-1.5 py-0.5 rounded leading-tight">
                          {row.freeSub}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-1.5 pl-6 pr-4 bg-gradient-to-r from-emerald-50/80 via-white to-amber-50/45 relative border-l border-emerald-100">
                      <div className="flex-1 text-center flex flex-col items-center justify-center">
                        <span className="text-xs font-black text-[#00875a] tracking-wide">
                          {row.pro}
                        </span>
                        {(row.info || row.proSub) && (
                          <span className="mt-1 max-w-[260px] text-[10px] font-semibold leading-snug text-slate-600">
                            {row.info || row.proSub}
                          </span>
                        )}
                      </div>

                      <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#1fa485]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Promotions;
