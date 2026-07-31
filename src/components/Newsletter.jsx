import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
    }
  };

  return (
    <section className="w-full px-4 py-12 md:py-16 bg-white ">
      <div className="max-w-[1300px] mx-auto bg-[#F4F7FA] rounded-[30px] md:rounded-[40px] px-6 sm:px-10 md:px-20 py-4 md:py-6 text-center shadow-sm">
        <div className="text-center w-full max-w-[1200px] mx-auto py-6 md:py-10 px-0 ">
          <h2 className="text-[28px] sm:text-[36px] md:text-[50px] leading-[1.2] tracking-[-3%] text-[#333] mb-4 md:mb-6 font-normal">
            Get Our <span className="text-[#1a9a6c] font-bold">Quarterly Newsletter</span>{" "}
            and <span className="text-[#1a9a6c] font-bold">Notifications</span>
          </h2>

          <p className="text-[#666] text-[14px] md:text-[16px] leading-[1.6] max-w-[1050px] mx-auto font-normal opacity-90">
            Stay updated with newly launched courses, top-rated institutes, and
            trending career paths across industries. Get curated insights,
            admission alerts, scholarship updates, and expert guidance delivered
            directly to you. Never miss opportunities that align with your
            goals.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="max-w-[650px] mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-[#D1D5DB] rounded-[15px] sm:rounded-[10px] p-2 shadow-sm gap-2 sm:gap-0">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email to get quarterly updates"
              className="flex-1 bg-transparent px-4 py-3 sm:py-2 outline-none text-[15px] md:text-[16px] text-gray-500 placeholder:text-gray-300 text-center sm:text-left"
            />
            <button
              type="submit"
              className="bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#555] font-medium px-8 py-3 sm:py-2.5 rounded-[10px] sm:rounded-[8px] text-[15px] transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </form>

        <div className="min-h-[24px]">
          {isSubscribed && (
            <p className="text-[#FF0000] text-[13px] md:text-[14px] font-medium italic px-2">
              * Thanks Ankit Maurya For Subscribing our Newsletter
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
