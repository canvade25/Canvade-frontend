import React from 'react'
import Navbar from "../components/Navbar";
import HomeHero from "../components/Home/HomeHero";
import AdvertisementBanner from "../components/Home/AdvertisementBanner";
import RecommendedCourses from "../components/Home/RecommendedCourses";
import UnderstandCanvade from "../components/Home/UnderstandCanvade";
import CollegeTrustLogos from "../components/Home/CollegeTrustLogos";
import CourseCategories, {
  CourseCategoriesFive,
  CourseCategoriesFour,
  CourseCategoriesSix,
  CourseCategoriesThree,
  CourseCategoriesTwo,
} from '../components/Home/CourseCategories';
import InstituteRecommendation, {
  InstituteRecommendationFour,
  InstituteRecommendationThree,
  InstituteRecommendationTwo,
} from '../components/Home/InstituteRecommendation';
import WorkshopsRegistration from '../components/Home/WorkshopsRegistration';
import NewsletterSection from '../components/Home/NewsletterSection';
import CategoryShowcaseDemo from '../components/Home/components/Categoryshowcasedemo';
// import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import CommunityHero from '../components/Home/components/communityHero';
import CourseCategoriesComponents from '../components/Home/components/categoriesComponets';
import whyChooseCanvade from '../components/Home/components/whyChooseCanvade';
import WhyChooseCanvade from '../components/Home/components/whyChooseCanvade';
const EmptyHomeSection = () => (
  <section className="bg-white py-10">
    <div className="mx-auto max-w-[1700px] px-4 md:px-8 lg:px-12">
      <div className="h-[360px] rounded-2xl bg-slate-100 md:h-[560px] lg:h-[760px]" />
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white ">
    
      <Navbar />

      <main className="flex-grow">
        <HomeHero />
        <AdvertisementBanner />
        <RecommendedCourses />
        <UnderstandCanvade />
        <CourseCategoriesComponents />
        
        {/* <CollegeTrustLogos /> */}
        <CourseCategories />
        {/* <CourseCategoriesTwo />
        <CourseCategoriesThree /> */}
        <CategoryShowcaseDemo />
        <AdvertisementBanner />
        <InstituteRecommendationTwo />
        {/* <InstituteRecommendationThree /> */}
        {/* <EmptyHomeSection /> */}
        <WhyChooseCanvade />
        <AdvertisementBanner />
        <CourseCategoriesFour />
        {/* <CourseCategoriesFive />
        <CourseCategoriesSix /> */}
        <CommunityHero />
        <AdvertisementBanner />
        {/* <EmptyHomeSection /> */}

        <InstituteRecommendation />
        {/* <InstituteRecommendationFour /> */}
        {/* <EmptyHomeSection /> */}
        {/* <WorkshopsRegistration /> */}
        <NewsletterSection />
      </main>

      {/* <Newsletter /> */}
      <Footer />
    </div>
  );
}
