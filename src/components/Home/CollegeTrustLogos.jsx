import React from "react";

const CollegeTrustLogos = () => {
  return null;

  const logoData = [
    { src: "/img1.png", alt: "IIT Madras Logo" },
    { src: "/img2.png", alt: "CA India Logo" },
    { src: "/img3.png", alt: "Stanford University Logo" },
    { src: "/img4.png", alt: "University of Notre Dame Logo" },
    { src: "/img5.png", alt: "SUNY Logo" },
    { src: "/img6.png", alt: "American University Logo" },
    { src: "/img7.png", alt: "Cornell University Logo" },
  ];

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-[1300px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-light mb-10 text-center tracking-tight">
          <span className="text-[#333333]">Top Indian</span>{" "}
          <span className="text-emerald-700">Colleges</span>{" "}
          <span className="text-[#333333]">trust us</span>
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {logoData.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              className="filter grayscale opacity-70 h-9 md:h-14 w-auto object-contain transition-all duration-300 hover:opacity-100 hover:grayscale-0 cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollegeTrustLogos;
