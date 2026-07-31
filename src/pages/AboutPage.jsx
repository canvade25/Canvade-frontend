import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  BookOpen,
  Code,
  GraduationCap,
  Palette,
  User as RunningUser,
  Briefcase,
  CheckCircle2,
  Building2,
  Globe,
  Users,
  ArrowRight,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="font-sans bg-slate-50/70 text-slate-900 selection:bg-emerald-100 min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-14 md:pt-[72px] lg:pt-[80px] space-y-4 md:space-y-6 pb-10">
        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12 pt-4 md:pt-6">
          <section className="bg-slate-50/70 shadow-sm p-5 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs md:text-sm font-bold tracking-wider text-emerald-600 uppercase block">
                    ABOUT CANVADE
                  </span>
                  <div className="w-10 h-[3px] bg-emerald-500 rounded"></div>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1B3D] tracking-tight leading-tight">
                  Discover the Right <br className="hidden sm:inline" />
                  Place to <span className="text-emerald-500">Learn</span>
                </h1>

                <p className="text-slate-700 text-sm md:text-base leading-relaxed antialiased max-w-[520px]">
                  CANVADE is a discovery-first education platform designed to
                  help students explore, compare, and connect with institutes,
                  educators, universities, academies, and skill-based programs —
                  all in one place.
                </p>

                <p className="text-slate-700 text-sm md:text-base leading-relaxed antialiased max-w-[520px]">
                  Instead of searching across dozens of websites, students can
                  discover verified courses, compare options, explore
                  categories, and choose the learning path that fits their
                  goals, interests, and future.
                </p>
              </div>

              <div className="relative justify-self-center lg:justify-self-end w-full max-w-xl pb-8">
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                  <img
                    src="/about 1.avif"
                    alt="Students collaborating around a laptop"
                    className="w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px] object-cover"
                  />
                </div>

                <div className="absolute -bottom-2 left-3 right-3 sm:left-6 sm:right-auto sm:w-[300px] lg:w-[340px] bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-50 flex items-center space-x-3 sm:space-x-4 transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="p-3 bg-emerald-200 rounded-full text-emerald-500 flex-shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#0B1B3D] text-sm sm:text-base">
                      One Platform.
                    </h4>
                    <p className="text-emerald-600 text-xs sm:text-sm font-medium">
                      Endless Learning Opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
          <section className="rounded-3xl border border-slate-100 bg-white shadow-sm p-5 sm:p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto space-y-3 md:space-y-4 mb-10 md:mb-16">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B1B3D]">
                Built for Modern Learning
              </h2>
              <p className="text-slate-600 text-sm md:text-[15px] font-medium leading-7 tracking-[0.2px]">
                From competitive exams and degree programs to online workshops
                and skill-based training, CANVADE brings different forms of
                education into one structured ecosystem.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 mb-10 md:mb-16 px-2 sm:px-4 -mt-4 md:-mt-8 relative">
              <div className="flex-1 flex flex-col items-center text-center space-y-4 w-full">
                <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#1B5E20] transition-transform hover:scale-105">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#0B1B3D] tracking-tight leading-snug">
                  Competitive <br className="hidden lg:inline" /> Exams
                </h3>
              </div>

              <div className="hidden lg:block w-px h-28 bg-slate-200 self-center"></div>
              <div className="block lg:hidden w-16 h-px bg-slate-200 my-2"></div>

              <div className="flex-1 flex flex-col items-center text-center space-y-4 w-full">
                <div className="w-20 h-20 rounded-full bg-[#F3E5F5] flex items-center justify-center text-[#4A148C] transition-transform hover:scale-105">
                  <Code className="w-10 h-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#0B1B3D] tracking-tight leading-snug">
                  Online Courses & <br className="hidden lg:inline" />{" "}
                  Certifications
                </h3>
              </div>

              <div className="hidden lg:block w-px h-28 bg-slate-200 self-center"></div>
              <div className="block lg:hidden w-16 h-px bg-slate-200 my-2"></div>

              <div className="flex-1 flex flex-col items-center text-center space-y-4 w-full">
                <div className="w-20 h-20 rounded-full bg-[#FFF8E1] flex items-center justify-center text-[#FF8F00] transition-transform hover:scale-105">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#0B1B3D] tracking-tight leading-snug">
                  Degree Programs <br className="hidden lg:inline" /> &
                  Universities
                </h3>
              </div>

              <div className="hidden lg:block w-px h-28 bg-slate-200 self-center"></div>
              <div className="block lg:hidden w-16 h-px bg-slate-200 my-2"></div>

              <div className="flex-1 flex flex-col items-center text-center space-y-4 w-full">
                <div className="w-20 h-20 rounded-full bg-[#FFEBEE] flex items-center justify-center text-[#C62828] transition-transform hover:scale-105">
                  <Palette className="w-10 h-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#0B1B3D] tracking-tight leading-snug">
                  Skills, Design & <br className="hidden lg:inline" />{" "}
                  Creativity
                </h3>
              </div>

              <div className="hidden lg:block w-px h-28 bg-slate-200 self-center"></div>
              <div className="block lg:hidden w-16 h-px bg-slate-200 my-2"></div>

              <div className="flex-1 flex flex-col items-center text-center space-y-4 w-full">
                <div className="w-20 h-20 rounded-full bg-[#E0F7FA] flex items-center justify-center text-[#00838F] transition-transform hover:scale-105">
                  <RunningUser className="w-10 h-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#0B1B3D] tracking-tight leading-snug">
                  Sports & <br className="hidden lg:inline" /> Fitness
                </h3>
              </div>

              <div className="hidden lg:block w-px h-28 bg-slate-200 self-center"></div>
              <div className="block lg:hidden w-16 h-px bg-slate-200 my-2"></div>

              <div className="flex-1 flex flex-col items-center text-center space-y-4 w-full">
                <div className="w-20 h-20 rounded-full bg-[#E8EAF6] flex items-center justify-center text-[#1A237E] transition-transform hover:scale-105">
                  <Briefcase className="w-10 h-10" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-[#0B1B3D] tracking-tight leading-snug">
                  Career & <br className="hidden lg:inline" /> Professional
                  Growth
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
              <div className="bg-[#F4F9F6] rounded-3xl p-5 sm:p-6 md:p-8 border border-emerald-100/50 flex flex-col justify-between relative overflow-hidden min-h-[260px] sm:min-h-[280px]">
                <div className="max-w-md space-y-6 z-10">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-full bg-[#109E6B] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <GraduationCap className="w-7 h-7" />
                    </div>

                    <div className="space-y-2 pt-1">
                      <h3 className="text-xl md:text-2xl font-semibold text-[#0B1B3D]">
                        For Students
                      </h3>
                      <p className="text-slate-600 text-xs md:text-sm leading-[1.8]">
                        CANVADE helps students make smarter learning decisions
                        with clarity and confidence.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-5">
                    {[
                      "Discover institutions globally",
                      "Compare courses and fees",
                      "Explore reviews and updates",
                      "Connect with educators",
                      "Make smarter learning decisions",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center space-x-4 text-[#0B1B3D] text-xs md:text-sm font-medium tracking-wide"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#109E6B] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3 text-white"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="absolute -bottom-6 -right-6 w-[50%] max-w-[260px] md:max-w-[320px] z-0 flex items-end justify-end overflow-hidden leading-[0]">
                  <img
                    src="/about 2.png"
                    alt="Student Graphic"
                    className="w-full h-auto object-contain block m-0 p-0 align-bottom"
                  />
                </div>
              </div>

              <div className="bg-[#F7F5FC] rounded-3xl p-5 sm:p-6 md:p-8 border border-purple-100/50 flex flex-col justify-between relative overflow-hidden min-h-[380px] sm:min-h-[420px]">
                <div className="max-w-md space-y-6 z-10">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-full bg-[#6B46C1] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <Building2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-2 pt-1">
                      <h3 className="text-xl md:text-2xl font-semibold text-[#0B1B3D]">
                        For Educators & Institutes
                      </h3>
                      <p className="text-slate-600 text-xs md:text-sm leading-[1.8]">
                        Educators and institutions can grow their visibility and
                        manage their operations with ease.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-5">
                    {[
                      "Showcase courses and programs",
                      "Publish updates and press releases",
                      "Manage enquiries effortlessly",
                      "Organize batches and schedules",
                      "Reach students beyond local visibility",
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center space-x-4 text-[#0B1B3D] text-xs md:text-sm font-medium tracking-wide"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#6B46C1] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-3 h-3 text-white"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="absolute -bottom-6 right-0 w-[50%] max-w-[260px] md:max-w-[320px] z-0 flex items-end justify-end overflow-hidden leading-[0]">
                  <img
                    src="/about 3.png"
                    alt="Institute Graphic"
                    className="w-full h-auto object-contain block m-0 p-0 align-bottom"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
          <section className="rounded-3xl border border-slate-100 bg-[#F7F5FC] shadow-sm p-5 sm:p-8 md:p-12 space-y-10 md:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-center space-y-6 py-2">
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B1B3D]">
                    A Discovery-First Ecosystem
                  </h2>
                  <div className="w-10 h-[3px] bg-emerald-500 rounded"></div>
                </div>

                <p className="text-slate-500 text-sm leading-[1.7]">
                  The platform is built around search, categories, visibility,
                  and accessibility.
                </p>

                <div className="space-y-1">
                  <p className="text-slate-600 font-medium text-xs md:text-sm">
                    Instead of focusing only on admissions, CANVADE focuses on:
                  </p>
                  <ul className="space-y-4 pt-4">
                    {[
                      "Helping students discover opportunities",
                      "Helping educators gain visibility",
                      "Making educational access more organized at scale",
                    ].map((text, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-slate-700 text-xs md:text-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full items-center">
                <div className="bg-white border border-slate-100/70 p-4 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center space-y-2 min-h-[150px] sm:min-h-[170px] h-auto sm:h-[210px]">
                  <div className="w-16 h-16 rounded-full bg-[#E8F8F2] flex items-center justify-center text-[#109E6B] flex-shrink-0">
                    <Users className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-semibold text-[#0B1B3D] tracking-tight">
                      10K+
                    </div>
                    <div className="text-xs font-bold text-slate-800 tracking-tight">
                      Institutions
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                      Across India
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100/70 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center space-y-4 min-h-[150px] sm:min-h-[170px] h-auto sm:h-[210px]">
                  <div className="w-16 h-16 rounded-full bg-[#F3EBF9] flex items-center justify-center text-[#7C3AED] flex-shrink-0">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-semibold text-[#0B1B3D] tracking-tight">
                      50K+
                    </div>
                    <div className="text-xs font-bold text-slate-800 tracking-tight">
                      Courses
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                      To explore
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100/70 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center space-y-4 min-h-[150px] sm:min-h-[170px] h-auto sm:h-[210px]">
                  <div className="w-16 h-16 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#EA580C] flex-shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-semibold text-[#0B1B3D] tracking-tight">
                      1M+
                    </div>
                    <div className="text-xs font-bold text-slate-800 tracking-tight">
                      Students
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                      Trust Canvade
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100/70 p-5 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center space-y-4 min-h-[150px] sm:min-h-[170px] h-auto sm:h-[210px]">
                  <div className="w-16 h-16 rounded-full bg-[#E6F7FA] flex items-center justify-center text-[#00A3C4] flex-shrink-0">
                    <Globe className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl md:text-3xl font-semibold text-[#0B1B3D] tracking-tight">
                      25+
                    </div>
                    <div className="text-xs font-bold text-slate-800 tracking-tight">
                      Countries
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                      Global reach
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#033E35] rounded-[1.5rem] md:rounded-[2.2rem] p-6 py-8 md:p-8 relative overflow-hidden text-white flex flex-col items-center justify-center min-h-[200px] md:min-h-[170px] shadow-lg">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[42%] md:w-[30%] h-full opacity-60 pointer-events-none select-none hidden sm:flex items-center justify-end pr-6">
                <img
                  src="/map.png"
                  alt="Worldmap Asset"
                  className="w-full max-w-[380px] h-auto object-contain"
                />
              </div>

              <div className="absolute left-0 -bottom-6 w-[42%] md:w-[30%] h-full pointer-events-none select-none hidden sm:flex items-end justify-start pl-4">
                <img
                  src="/map1.png"
                  alt="Graduation Cap 3D Asset"
                  className="w-full md:w-[380px] h-auto object-contain"
                />
              </div>

              <div className="text-center space-y-5 max-w-2xl z-10 px-4 flex flex-col items-center justify-center">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-bold tracking-tight text-white">
                    Learn Smarter. Choose Better.
                  </h3>

                  <p className="text-emerald-100/75 text-xs md:text-sm font-light leading-relaxed max-w-md mx-auto tracking-wide">
                    CANVADE is building a simpler and more connected way for the
                    world to discover education.
                  </p>
                </div>

                <div className="w-full sm:w-auto pt-1">
                  <button className="w-full sm:w-auto bg-white text-[#033E35] hover:bg-emerald-50 active:scale-[0.98] transition-all duration-200 font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center shadow-md group">
                    <span className="pr-4">Start Your Journey Today</span>

                    <div className="border-l border-emerald-900/15 pl-3 py-0.5 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-[#033E35] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
