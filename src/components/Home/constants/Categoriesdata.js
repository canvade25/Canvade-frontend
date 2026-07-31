import { TrendingUp, Search } from 'lucide-react';

// Each entry maps 1:1 to a <CategoryShowcase /> instance.
// `image` is a single pre-composed collage graphic (preferred).
// `images` is a fallback 3-photo CSS collage — keep the order
// [topLeft, topRight, bottomCenter] — used only when `image` is absent.
export const categories = [
  {
    id: 'govt-exams',
    category: 'Government Exams Preparation',
    description:
      'Government jobs are among the most sought-after career choices, offering job security, competitive salaries, career growth, pensions (where applicable), and the opportunity to serve the nation. Explore preparation courses for UPSC, SSC, Banking, Railways, Defense, Teaching, State PSCs, and many other competitive exams - all in one place.',
    features: [
      {
        icon: TrendingUp,
        title: 'Build a Secure Career',
        description:
          'Prepare with expert-designed courses, structured study plans, mock tests, and comprehensive learning resources to improve your chances of success in highly competitive government examinations.',
      },
      {
        icon: Search,
        title: 'Find the Right Preparation',
        description:
          'Compare top coaching institutes, online programs, course fees, learning modes, ratings, and student reviews to choose the preparation that best aligns with your goals.',
      },
    ],
    image: { src: '/01-government-exams.png', alt: 'Students preparing for government exams' },
  },
  {
    id: 'information-technology',
    category: 'Information Technology',
    description:
      "Information Technology (IT) powers the digital world, creating opportunities across software development, cybersecurity, cloud computing, networking, data analytics, and IT support. Whether you're starting your career or upgrading your skills, IT courses can prepare you for one of the fastest-growing and highest-paying industries worldwide.",
    features: [
      {
        icon: TrendingUp,
        title: 'Build Future-Ready Skills',
        description:
          'Gain practical knowledge in programming, cloud technologies, cybersecurity, databases, networking, and emerging technologies through industry-focused courses designed for today\'s job market.',
      },
      {
        icon: Search,
        title: 'Find the Right IT Course',
        description:
          'Explore and compare top IT institutes, certifications, online and offline programs, course fees, ratings, and learning modes to choose the path that matches your career goals.',
      },
    ],
    image: { src: '/04-information-technology.png', alt: 'IT professionals working' },
  },
  {
    id: 'software-development',
    category: 'Software Development',
    description:
      "Software Development is at the core of today's digital economy, powering everything from mobile apps and websites to enterprise systems and AI-driven solutions. With businesses across every industry embracing technology, skilled software developers are in high demand and enjoy excellent career growth, competitive salaries, and global opportunities.",
    features: [
      {
        icon: TrendingUp,
        title: 'Develop In-Demand Skills',
        description:
          'Learn programming languages, web and mobile development, databases, software engineering, testing, version control, and modern development frameworks through practical, industry-focused training.',
      },
      {
        icon: Search,
        title: 'Find the Right Development Course',
        description:
          'Explore and compare software development courses, coding bootcamps, certifications, institutes, fees, learning modes, ratings, and student reviews to choose the program that fits your career aspirations.',
      },
    ],
    image: { src: '/05-software-development.png', alt: 'Software developers working' },
  },
  {
    id: 'data-science',
    category: 'Data Science',
    description:
      'Data Science transforms raw data into valuable insights that drive business decisions, innovation, and growth. As organizations increasingly rely on data, skilled data scientists are in high demand across industries such as technology, healthcare, finance, retail, and manufacturing, making it one of the most rewarding career paths today.',
    features: [
      {
        icon: TrendingUp,
        title: 'Master Data-Driven Skills',
        description:
          'Learn data analysis, statistics, Python, machine learning, data visualization, SQL, and AI concepts through practical projects and industry-relevant training designed for real-world applications.',
      },
      {
        icon: Search,
        title: 'Find the Right Data Science Course',
        description:
          'Explore and compare top Data Science institutes, certifications, online and offline programs, course fees, learning modes, ratings, and student reviews to choose the course that aligns with your career goals.',
      },
    ],
    image: { src: '/06-data-science.png', alt: 'Data scientists analyzing data' },
  },
  {
    id: 'cyber-security',
    category: 'Cyber Security',
    description:
      'Cyber Security is one of the fastest-growing fields in technology, dedicated to protecting systems, networks, and sensitive data from cyber threats. As businesses, governments, and individuals become more reliant on digital infrastructure, cybersecurity professionals are in high demand, offering excellent career prospects, competitive salaries, and global opportunities.',
    features: [
      {
        icon: TrendingUp,
        title: 'Build Critical Security Skills',
        description:
          'Learn ethical hacking, network security, penetration testing, digital forensics, cloud security, risk management, and security best practices through hands-on, industry-focused training.',
      },
      {
        icon: Search,
        title: 'Find the Right Cyber Security Course',
        description:
          'Explore and compare top Cyber Security institutes, certifications, online and offline programs, course fees, learning modes, ratings, and student reviews to choose the course that best supports your career goals.',
      },
    ],
    image: { src: '/08-cyber-security.png', alt: 'Cyber security professionals at work' },
  },
  {
    id: 'cloud-computing',
    category: 'Cloud Computing',
    description:
      'Cloud Computing is transforming the way businesses build, manage, and scale digital services. From startups to global enterprises, organizations rely on cloud platforms to store data, deploy applications, and improve efficiency. With the rapid adoption of cloud technologies, professionals with cloud expertise are among the most sought-after in the IT industry.',
    features: [
      {
        icon: TrendingUp,
        title: 'Gain In-Demand Cloud Skills',
        description:
          'Learn cloud platforms, virtualization, cloud architecture, DevOps fundamentals, containerization, security, and infrastructure management through practical, industry-focused training.',
      },
      {
        icon: Search,
        title: 'Find the Right Cloud Computing Course',
        description:
          'Explore and compare top Cloud Computing institutes, certifications, online and offline programs, course fees, learning modes, ratings, and student reviews to choose the course that fits your career goals.',
      },
    ],
    image: { src: '/09-cloud-computing.png', alt: 'Cloud computing engineers at work' },
  },
  {
    id: 'business-management',
    category: 'Business Management',
    description:
      'Business Management equips individuals with the knowledge and leadership skills needed to plan, manage, and grow successful organizations. Whether you aspire to become an entrepreneur, manager, consultant, or business leader, studying business management opens doors to diverse career opportunities across industries worldwide.',
    features: [
      {
        icon: TrendingUp,
        title: 'Develop Leadership & Business Skills',
        description:
          'Build expertise in marketing, finance, operations, human resources, strategy, communication, and decision-making through practical, industry-oriented learning that prepares you for real-world business challenges.',
      },
      {
        icon: Search,
        title: 'Find the Right Business Management Course',
        description:
          'Explore and compare top Business Management institutes, degree programs, certifications, course fees, learning modes, ratings, and student reviews to choose the program that best supports your career ambitions.',
      },
    ],
    image: { src: '/10-business-management.png', alt: 'Business managers at work' },
  },
  {
    id: 'finance',
    category: 'Finance',
    description:
      'Finance is the foundation of every successful business, investment, and economic decision. Whether you aspire to work in banking, corporate finance, investment management, accounting, or financial planning, finance courses equip you with the analytical and strategic skills needed to build a rewarding and future-ready career.',
    features: [
      {
        icon: TrendingUp,
        title: 'Build Strong Financial Expertise',
        description:
          'Develop practical skills in financial management, investment analysis, accounting, taxation, budgeting, risk management, and financial planning through industry-relevant courses and expert guidance.',
      },
      {
        icon: Search,
        title: 'Find the Right Finance Course',
        description:
          'Explore and compare top Finance institutes, degree programs, professional certifications, course fees, learning modes, ratings, and student reviews to choose the course that aligns with your career goals.',
      },
    ],
    image: { src: '/11-finance.png', alt: 'Finance professionals at work' },
  },
  {
    id: 'digital-marketing',
    category: 'Digital Marketing',
    description:
      'Digital Marketing has become essential for businesses to reach, engage, and grow their audience online. From startups and global brands to e-commerce and personal businesses, skilled digital marketers are in high demand, offering exciting career opportunities, freelancing potential, and entrepreneurial growth.',
    features: [
      {
        icon: TrendingUp,
        title: 'Learn Industry-Relevant Marketing Skills',
        description:
          'Master SEO, social media marketing, Google Ads, content marketing, email marketing, analytics, branding, and performance marketing through practical, hands-on training with real-world projects.',
      },
      {
        icon: Search,
        title: 'Find the Right Digital Marketing Course',
        description:
          'Explore and compare top Digital Marketing institutes, certification programs, course fees, learning modes, ratings, and student reviews to choose the course that best supports your career or business goals.',
      },
    ],
    image: { src: '/12-digital-marketing.png', alt: 'Digital marketing professionals at work' },
    images: [
      { src: '/digital01.avif', alt: 'Digital marketing campaign dashboard' },
      { src: '/digital02.avif', alt: 'Marketer working on digital strategy' },
      { src: '/digital03.avif', alt: 'Digital marketing performance analytics' },
    ],
  },
  {
    id: 'graphic-design',
    category: 'Graphic Design',
    description:
      'Graphic Design combines creativity with technology to communicate ideas through compelling visuals. From branding and advertising to social media, web design, and digital marketing, skilled graphic designers are in demand across industries, making it an exciting career for creative professionals and aspiring designers.',
    features: [
      {
        icon: TrendingUp,
        title: 'Build Creative Design Skills',
        description:
          'Learn typography, color theory, branding, layout design, illustration, photo editing, and industry-standard tools like Adobe Photoshop, Illustrator, and Figma through hands-on, project-based learning.',
      },
      {
        icon: Search,
        title: 'Find the Right Graphic Design Course',
        description:
          'Explore and compare top Graphic Design institutes, certification programs, course fees, learning modes, ratings, and student reviews to choose the course that matches your creative goals and career aspirations.',
      },
    ],
    image: { src: '/17-graphic-design.png', alt: 'Graphic designers at work' },
  },
  {
    id: 'artificial-intelligence',
    category: 'Artificial Intelligence',
    description:
      'Artificial Intelligence (AI) is revolutionizing industries by enabling machines to learn, solve problems, and make intelligent decisions. From healthcare and finance to education, manufacturing, and automation, AI professionals are shaping the future with innovative solutions, making it one of the fastest-growing and most rewarding career fields.',
    features: [
      {
        icon: TrendingUp,
        title: 'Master Future-Ready AI Skills',
        description:
          'Learn machine learning, deep learning, natural language processing, computer vision, generative AI, Python, and data-driven problem-solving through practical, industry-focused training.',
      },
      {
        icon: Search,
        title: 'Find the Right AI Course',
        description:
          'Explore and compare top Artificial Intelligence institutes, certifications, degree programs, course fees, learning modes, ratings, and student reviews to choose the course that aligns with your career ambitions.',
      },
    ],
    image: { src: '/07-artificial-intelligence.png', alt: 'AI professionals at work' },
  },
  {
    id: 'sales',
    category: 'Sales',
    description:
      'Sales drives revenue and growth for every business, from startups to global enterprises. Skilled sales professionals are always in demand, offering strong earning potential, fast career progression, and opportunities across nearly every industry.',
    features: [
      {
        icon: TrendingUp,
        title: 'Build High-Impact Sales Skills',
        description:
          'Learn prospecting, negotiation, CRM tools, pipeline management, objection handling, and closing techniques through practical, industry-focused training.',
      },
      {
        icon: Search,
        title: 'Find the Right Sales Course',
        description:
          'Explore and compare top Sales institutes, certifications, course fees, learning modes, ratings, and student reviews to choose the course that best fits your career goals.',
      },
    ],
    image: { src: '/14-sales.png', alt: 'Sales professionals at work' },
  },
  {
    id: 'entrepreneurship',
    category: 'Entrepreneurship',
    description:
      'Entrepreneurship equips aspiring founders with the mindset and practical skills to build, launch, and scale their own ventures. From idea validation to fundraising and operations, entrepreneurship courses prepare you to navigate the challenges of starting and growing a business.',
    features: [
      {
        icon: TrendingUp,
        title: 'Develop a Founder\'s Mindset',
        description:
          'Learn idea validation, business planning, fundraising, marketing, and operations through practical, real-world focused training designed for aspiring entrepreneurs.',
      },
      {
        icon: Search,
        title: 'Find the Right Entrepreneurship Course',
        description:
          'Explore and compare top Entrepreneurship programs, incubator-linked courses, certifications, fees, ratings, and student reviews to choose the course that best supports your venture.',
      },
    ],
    image: { src: '/15-entrepreneurship.png', alt: 'Entrepreneurs at work' },
  },
];
