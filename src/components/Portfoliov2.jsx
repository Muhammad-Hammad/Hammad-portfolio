import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaCog,
  FaProjectDiagram,
  FaCertificate,
  FaGraduationCap,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaLink,
} from 'react-icons/fa';
import CustomCursor from './CustomCursor';

const sections = [
  { id: 'hero', title: 'Home', icon: FaHome },
  { id: 'about', title: 'About', icon: FaUser },
  { id: 'experience', title: 'Experience', icon: FaBriefcase },
  { id: 'skills', title: 'Skills', icon: FaCog },
  { id: 'projects', title: 'Projects', icon: FaProjectDiagram },
  { id: 'certificates', title: 'Certificates', icon: FaCertificate },
  { id: 'education', title: 'Education', icon: FaGraduationCap },
];

const experiences = [
  {
    title: 'Software Engineer',
    company: 'Qavi Technologies',
    period: '10/2021 - Present',
    location: 'Hybrid, Karachi',
    responsibilities: [
      'Built high-end responsive UI web listing pages, improving user accessibility and experience across devices.',
      'Developed a generic Stepper form with Drag and Drop functionality, increasing form completion efficiency.',
      'Designed and implemented a highly dynamic form builder, reducing manual form configurations by 40%.',
      'Migrated Angular 9 to 11, improving application performance and maintaining codebase.',
      'Wrote a script under supervision to sync Active Directory with Azure cloud using LDAP, streamlining user management.',
      'Built an Invoice-Purchase-Order parsing comparator form using Google Document AI under supervision.',
      'Integrated a history logger into an existing file management system, improving traceability of user actions.',
      'Implemented a notification strategy under supervision, enhancing user engagement and alerting system.',
      'Created and implemented a strategy to fetch Outlook mailbox emails, displaying them in a responsive UI listing, optimizing email processing.',
      'Used Framer motion to create interactive buttons with AutoComplete Suggestion box and staggered animations, elevating the user experience.',
    ],
  },
  {
    title: 'Junior Software Engineer',
    company: 'Digitli',
    period: '08/2021 - 10/2021',
    location: 'Onsite, Contract, Karachi',
    responsibilities: [
      'Developed a cross-platform e-commerce app using Flutter, GetX, and Google Maps API, implementing state management, listing, cart functionalities, and custom UI components.',
    ],
  },
  {
    title: 'Junior Frontend Developer',
    company: 'Computing Yard',
    period: '01/2021 - 06/2021',
    location: 'Remote',
    responsibilities: [
      'Contributed to a multilingual real estate web app using TypeScript, NextJS, and GraphQL.',
      'Developed utility functions and custom hooks in an agile workflow, ensuring on-time delivery.',
      'Integrated React-i18next for multi-language support and created modular components, including stepper forms and multi-select dropdowns.',
    ],
  },
  {
    title: 'Junior Software Developer',
    company: 'Freelance (Self-employed)',
    period: '02/2020 - 12/2020',
    location: 'Remote',
    responsibilities: [
      'Collaborated remotely with a Middle Eastern team, leveraging agile methodologies to accelerate task delivery.',
      'Worked on implementing Atomic Design with Lerna and Single SPA, developing dynamic tables and modules with pagination.',
      'Enhanced code quality by creating stories in Storybook and writing test cases using Jest.',
    ],
  },
  {
    title: 'React Intern',
    company: 'CQ Technologies',
    period: '12/2019 - 01/2020',
    location: 'Remote, Contract',
    responsibilities: [
      'Collaborated on a web application using JavaScript, React, Redux, and PWA technologies.',
      'Created responsive UI through media queries to ensure cross-device compatibility.',
    ],
  },
];

const skills = [
  'ReactJS',
  'NextJS',
  'Angular',
  'JavaScript',
  'TypeScript',
  'NodeJS',
  'ExpressJS',
  'NestJS',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'Flutter',
  'Dart',
  'Firebase',
  'GraphQL',
  'Redis',
  'Git',
  'Material UI',
  'Radix UI',
  'AntDesign',
  'Sass',
  'React Native',
  'ShadCN',
  'Storybook',
  'Jest',
  'Github Actions',
  'AWS S3',
  'Open AI',
];

const projects = [
  {
    title: 'Spotify Playlist Generator using OpenAI and Spotify API',
    link: 'https://github.com/Muhammad-Hammad/spotify-playlist-fetcher',
    description:
      'Users can search for moods, songs, or artists, and the app uses OpenAI and the Spotify Web API to create a playlist and display details, including song previews.',
  },
  {
    title: 'Campus-Recruitment-System Web-App',
    link: 'https://github.com/Muhammad-Hammad/campus-web-app',
    description:
      'ReactJS Redux based system handling role-based Authentication, Realtime Database, and Hosting with Firebase.',
  },
  {
    title: 'Expense Tracker Web-App',
    link: 'https://github.com/Muhammad-Hammad/expense-tracker-app',
    description:
      'ReactJS based expense tracker web-app deployed with Surge token on GitHub.',
  },
];

const certificates = [
  {
    link: 'https://www.linkedin.com/learning/certificates/c2dd0e25778db65a293ae04da605ff2b639c1e69e1dd30c7ed742fb91434f8b6?trk=share_certificate',
    title: 'Level Up: Javascript by Emma Bostian.',
  },
  {
    title: 'Responsive Web Design Certification by FreeCodeCamp.org',
    link: 'https://www.freecodecamp.org/certification/smhammad/responsive-web-design',
  },
  {
    title: 'Introduction to MongoDB (M001: MongoDB Basics)',
    link: 'https://ti-user-certificates.s3.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/628e3a64-6546-51cc-8b2f-cab417cb6a15-syed-muhammad-hammad-ghani-985b2076-307e-5fdf-b21d-37789d967be2-certificate.pdf',
  },
  {
    title: 'Certified in MS Office (Word, Excel, Powerpoint)',
    link: 'https://www.credly.com/users/syed-muhammad-hammad-ghani',
  },
  {
    title: ' React Essentials from Lynda.com.',
  },
  {
    title: 'Web-App Development by Saylani Mass IT Training.',
  },
  {
    title:
      'Won an interdepartmental UI development Competition at Dawood University of Engineering and Technology.',
  },
];

// eslint-disable-next-line react/prop-types
function StarField({ count = 5000 }) {
  const points = useMemo(() => new Float32Array(count * 3), [count]);
  const ref = useRef(null);
  const { size, mouse } = useThree();
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (points) {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        points[i3] = (Math.random() - 0.5) * 20;
        points[i3 + 1] = (Math.random() - 0.5) * 20;
        points[i3 + 2] = (Math.random() - 0.5) * 50 - 25;
      }
    }
  }, [points, count]);

  useFrame(state => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = time * 0.05;

      const positions = ref.current.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 2] += 0.05;
        if (positions[i3 + 2] > 25) {
          positions[i3 + 2] = -25;
        }

        if (hovered) {
          const mouseX = (mouse.x * size.width) / 2;
          const mouseY = (mouse.y * size.height) / 2;
          const dx = mouseX - positions[i3];
          const dy = mouseY - positions[i3 + 1];
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelForce = Math.min(0.1, 1 / (dist + 0.1));
          positions[i3] += dx * repelForce * 0.01;
          positions[i3 + 1] += dy * repelForce * 0.01;
        }
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points
      ref={ref}
      positions={points}
      stride={3}
      frustumCulled={false}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={true}
      />
    </Points>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const sectionRefs = useRef({});

  const longPressTimeoutRef = useRef(null); // To store timeout for long press

  const handleTouchStart = id => {
    // Start the long press detection
    longPressTimeoutRef.current = setTimeout(() => {
      setHoveredIcon(id); // Trigger hover state on long press
    }, 500); // Adjust the duration to your preference
  };

  const handleTouchEnd = () => {
    // Clear long press timeout on touch end
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    setHoveredIcon(null); // Reset hover state after touch ends
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const windowHeight = window.innerHeight;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[sections[i].id];
        if (
          section &&
          section.offsetTop - windowHeight / 2 < currentScrollPos
        ) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = id => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="fixed top-4 left-4 z-[100] lg:hidden">
        <button
          className={`text-white focus:outline-none p-2 ${
            isSidebarOpen ? '' : 'rounded-full bg-gray-800/90'
          }`}
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          {/* Hamburger icon */}
          {isSidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>
      {/* <motion.nav
        className={`fixed left-0 top-0 h-full z-40 bg-gray-800 bg-opacity-90 shadow-lg transform transition-transform duration-300
          ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        initial={{ width: '60px' }}
        animate={{ width: isSidebarOpen ? '200px' : '60px' }}
        onHoverStart={() => setIsSidebarOpen(true)}
        onHoverEnd={() => setIsSidebarOpen(false)}
      >
        <ul className="flex flex-col items-center space-y-4 p-4 mt-20">
          {sections.map(section => (
            <motion.li
              key={section.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => scrollTo(section.id)}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  activeSection === section.id
                    ? 'text-teal-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <section.icon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-2">{section.title}</span>}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.nav> */}
      <motion.nav
        className={`fixed left-0 top-0 h-full z-50 bg-gray-800 bg-opacity-90 shadow-lg w-20 duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        // initial={{ width: '0px' }}
        // animate={{ width: isSidebarOpen ? '60px' : '0px' }}
      >
        <ul className="flex flex-col items-center space-y-8 p-4 mt-20">
          {sections.map(section => (
            <motion.li
              key={section.id}
              className="relative"
              onHoverStart={() => setHoveredIcon(section.id)}
              onHoverEnd={() => setHoveredIcon(null)}
              onTouchStart={() => handleTouchStart(section.id)} // For touch devices
              onTouchEnd={handleTouchEnd} // Reset hover state on touch end
            >
              <div className="relative w-12 h-12">
                {/* Dark icon (stays in place) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-full ${
                    // activeSection === section.id
                    //   ? 'bg-teal-400 text-gray-900'
                    //   : 'bg-gray-700 text-gray-500'
                    activeSection === section.id
                      ? 'bg-teal-400 text-gray-900'
                      : 'bg-gray-600 text-gray-900'
                  }`}
                  onClick={() => scrollTo(section.id)}
                >
                  <section.icon className="w-6 h-6" />
                </div>

                {/* Colored icon (moves and tilts on hover) */}
                <motion.div
                  className={`absolute inset-0 flex items-center justify-center rounded-full ${
                    activeSection === section.id ? 'text-gray-900' : ''
                  }`}
                  initial={false}
                  animate={
                    hoveredIcon === section.id
                      ? { x: 40, rotate: 15, scale: 1.2, color: 'white' }
                      : { x: 0, rotate: 0, scale: 1 }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => scrollTo(section.id)}
                >
                  <section.icon className="w-6 h-6" />
                </motion.div>
              </div>

              {/* Text label */}
              {hoveredIcon === section.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 40 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md whitespace-nowrap shadow-lg"
                >
                  {section.title}
                </motion.div>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <div className="relative z-20">
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            ref={el => (sectionRefs.current[section.id] = el)}
            className={`min-h-screen flex items-center justify-center z-10 ${
              index != 0 ? 'py-4' : ''
            } snap-start`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {section.id === 'hero' && (
              <div className="relative w-full h-screen">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center z-10"
                  >
                    <img
                      src="/avatar.png"
                      alt="Hammad Ghani"
                      className="rounded-full mx-auto mb-8 w-48 h-48 object-cover z-20"
                      loading="lazy"
                    />
                    <h1 className="text-6xl font-bold mb-4 z-20">
                      Hammad Ghani
                    </h1>
                    <h2 className="text-2xl mb-8 z-20">
                      Fullstack Developer (Frontend-Heavy) | JavaScript
                      Enthusiast
                    </h2>
                    <div className="flex justify-center space-x-4 z-50">
                      <button
                        onClick={() =>
                          window.open('mailto:hammy.pk30@gmail.com', '_blank')
                        }
                        className="p-2 bg-transparent cursor-none hover:bg-teal-600 rounded-full transition-colors duration-300 z-50"
                        aria-label="Email"
                        data-class="cursor"
                      >
                        <FaEnvelope
                          size={24}
                          className="text-teal-400 hover:text-teal-300"
                          data-class="cursor"
                        />
                      </button>

                      <button
                        onClick={() =>
                          window.open('tel:+923151068487', '_blank')
                        }
                        data-class="cursor"
                        className="p-2 bg-transparent cursor-none hover:bg-teal-600 rounded-full transition-colors duration-300 z-50"
                        aria-label="Phone"
                      >
                        <FaPhone
                          size={24}
                          className="text-teal-400 hover:text-teal-300"
                          data-class="cursor"
                        />
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            'http://www.linkedin.com/in/syed-muhammad-hammad-ghani',
                            '_blank'
                          )
                        }
                        data-class="cursor"
                        className="p-2 bg-transparent cursor-none hover:bg-teal-600 rounded-full transition-colors duration-300 z-50"
                        aria-label="LinkedIn"
                      >
                        <FaLinkedin
                          size={24}
                          className="text-teal-400 hover:text-teal-300"
                          data-class="cursor"
                        />
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            'http://www.github.com/muhammad-hammad',
                            '_blank'
                          )
                        }
                        data-class="cursor"
                        className="p-2 bg-transparent cursor-none hover:bg-teal-600 rounded-full transition-colors duration-300 z-50"
                        aria-label="GitHub"
                      >
                        <FaGithub
                          size={24}
                          className="text-teal-400 hover:text-teal-300"
                          data-class="cursor"
                        />
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            'https://topmate.io/syed_muhammad_hammad_ghani/1253394',
                            '_blank'
                          )
                        }
                        data-class="cursor"
                        className="p-2 bg-transparent cursor-none hover:bg-teal-600 rounded-full transition-colors duration-300 z-50"
                        aria-label="Portfolio"
                      >
                        <FaLink
                          size={24}
                          className="text-teal-400 hover:text-teal-300"
                          data-class="cursor"
                        />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {section.id === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl text-center"
              >
                <h2 className="text-4xl font-bold mb-8">About Me</h2>
                <p className="text-lg mb-4">
                  Building and scaling robust web-apps for more than 4+ years of
                  experience as a Full-stack Engineer (Frontend-Heavy) with
                  ReactJS, TypeScript, Angular, NextJS, NodeJS, ExpressJS, and
                  SQL in Agile environments. I have led teams, maintained code
                  quality, ensured productivity, and delivered projects on time.
                </p>
                <p className="text-lg">
                  Based in Karachi, Pakistan, I&apos;m passionate about creating
                  efficient and user-friendly web applications.
                </p>
              </motion.div>
            )}

            {section.id === 'experience' && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                  Work Experience
                </h2>
                {experiences.map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="mb-12 bg-gray-800 rounded-lg p-6 shadow-lg"
                  >
                    <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                    <h4 className="text-xl text-teal-400 mb-2">
                      {exp.company}
                    </h4>
                    <p className="text-gray-400 mb-4">
                      {exp.period} | {exp.location}
                    </p>
                    <ul className="list-disc list-inside">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="mb-2">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            )}

            {section.id === 'skills' && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-medium z-50"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            )}

            {section.id === 'projects' && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                  Personal Projects
                </h2>
                {projects.map(project => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      window.open(project.link, '_blank');
                    }}
                    className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg"
                    data-class="cursor"
                  >
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p>{project.description}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {section.id === 'certificates' && (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">
                  Certificates
                </h2>
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="list-disc list-inside"
                >
                  {certificates.map((cert, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className={`mb-4 text-lg`}
                      data-class={cert.link ? 'cursor' : ''}
                      onClick={() => {
                        if (cert.link) {
                          window.open(cert.link, '_blank');
                        }
                      }}
                    >
                      {cert.title}
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            )}

            {section.id === 'education' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl text-center"
              >
                <h2 className="text-4xl font-bold mb-8">Education</h2>
                <h3 className="text-2xl font-bold mb-2">
                  Bachelors of Engineering
                </h3>
                <h4 className="text-xl text-teal-400 mb-2">
                  Dawood University of Engineering and Technology Karachi
                </h4>
                <p className="mb-4">01/2017 - 12/2020 | CGPA 3.23</p>
              </motion.div>
            )}
          </motion.section>
        ))}
      </div>
      <motion.div
        className="fixed inset-0 z-10 opacity-40"
        style={{
          background:
            'linear-gradient(135deg, #008080 0%, #000000 50%, #0000FF 100%)',
        }}
      />
      <motion.div
        className="fixed inset-0 z-20 top-0 left-0 right-0 h-2 bg-gray-200 rounded-r-lg shadow-[0_0_10px_rgba(0,128,128,0.6),_0_0_15px_rgba(0,0,255,0.4)] 
                   bg-gradient-to-r from-teal-700 via-black/50 to-blue-500 animate-gradient-move"
        style={{
          width,
        }}
      />
      <motion.div className="fixed top-0 w-[100vw] h-[100vh]">
        <Canvas className="absolute inset-0">
          <StarField count={3000} />
        </Canvas>
      </motion.div>
      <CustomCursor />
    </div>
  );
}
