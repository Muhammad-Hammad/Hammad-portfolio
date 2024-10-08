/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { FaHome, FaUser, FaBriefcase, FaCog, FaProjectDiagram, FaCertificate, FaGraduationCap, FaEnvelope, FaPhone, FaLinkedin, FaGithub } from 'react-icons/fa'

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
}

const sections: Section[] = [
  { id: 'hero', title: 'Home', icon: FaHome },
  { id: 'about', title: 'About', icon: FaUser },
  { id: 'experience', title: 'Experience', icon: FaBriefcase },
  { id: 'skills', title: 'Skills', icon: FaCog },
  { id: 'projects', title: 'Projects', icon: FaProjectDiagram },
  { id: 'certificates', title: 'Certificates', icon: FaCertificate },
  { id: 'education', title: 'Education', icon: FaGraduationCap },
]

interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

const experiences: Experience[] = [
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
]

const skills: string[] = [
  'ReactJS', 'NextJS', 'Angular', 'JavaScript', 'TypeScript', 'NodeJS', 'ExpressJS', 'NestJS',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Flutter', 'Dart', 'Firebase', 'GraphQL', 'Redis', 'Git',
  'Material UI', 'Radix UI', 'AntDesign', 'Sass', 'React Native', 'ShadCN', 'Storybook',
  'Jest', 'Github Actions', 'AWS S3', 'Open AI'
]

interface Project {
  title: string;
  description: string;
}

const projects: Project[] = [
  {
    title: 'Spotify Playlist Generator using OpenAI and Spotify API',
    description: 'Users can search for moods, songs, or artists, and the app uses OpenAI and the Spotify Web API to create a playlist and display details, including song previews.',
  },
  {
    title: 'Campus-Recruitment-System Web-App',
    description: 'ReactJS Redux based system handling role-based Authentication, Realtime Database, and Hosting with Firebase.',
  },
  {
    title: 'Expense Tracker Web-App',
    description: 'ReactJS based expense tracker web-app deployed with Surge token on GitHub.',
  },
]

const certificates: string[] = [
  'Level Up: Javascript by Emma Bostian.',
  'Responsive Web Design Certification by FreeCodeCamp.org',
  'Introduction to MongoDB (M001: MongoDB Basics)',
  'Certified in MS Office (Word, Excel, Powerpoint)',
  'React Essentials from Lynda.com.',
  'Web-App Development by Saylani Mass IT Training.',
  'Won an interdepartmental UI development Competition at Dawood University of Engineering and Technology.',
]

interface StarFieldProps {
  count?: number;
}

function StarField({ count = 1000000 }: StarFieldProps) {
  const points = useMemo(() => new Float32Array(count * 3), [count])
  const ref = useRef<THREE.Points>(null)
  const { size, mouse } = useThree()
  const [ripple, setRipple] = useState({ active: false, position: new THREE.Vector3() })

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      points[i3] = (Math.random() - 0.5) * 10
      points[i3 + 1] = (Math.random() - 0.5) * 10
      points[i3 + 2] = (Math.random() - 0.5) * 10
    }
  }, [points, count])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x = Math.sin(time / 10)
      ref.current.rotation.y = Math.sin(time / 15)
      ref.current.rotation.z = Math.sin(time / 20)

      const positions = ref.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positions[i3]
        const y = positions[i3 + 1]
        const z = positions[i3 + 2]

        // Mouse repulsion
        const mouseX = (mouse.x * size.width) / 2
        const mouseY = (mouse.y * size.height) / 2
        const dx = x - mouseX
        const dy = y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repulsionForce = Math.max(0, 1 - dist / 100)

        positions[i3] += dx * repulsionForce * 0.01
        positions[i3 + 1] += dy * repulsionForce * 0.01

        // Ripple effect
        if (ripple.active) {
          const dx = x - ripple.position.x
          const dy = y - ripple.position.y
          const dz = z - ripple.position.z
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          const rippleForce = Math.sin(dist * 0.5 - time * 5) * 0.2
          positions[i3] += dx * rippleForce * 0.01
          positions[i3 + 1] += dy * rippleForce * 0.01
          positions[i3 + 2] += dz * rippleForce * 0.01
        }
      }

      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const handlePointerDown = (event: any) => {
    const { point } = event
    setRipple({ active: true, position: point })
    setTimeout(() => setRipple({ active: false, position: new THREE.Vector3() }), 1000)
  }

  return (
    <Points ref={ref} positions={points} stride={3} frustumCulled={false} onPointerDown={handlePointerDown}>
      <PointMaterial transparent color="#8888ff" size={0.02} sizeAttenuation={true} depthWrite={false} />
    </Points>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero')
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset
      const windowHeight = window.innerHeight
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[sections[i].id]
        if (section && section.offsetTop - windowHeight / 2 < currentScrollPos) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Canvas className="fixed inset-0 z-0">
        <StarField />
      </Canvas>

      <motion.div
        className="fixed inset-0 z-10 opacity-50"
        style={{
          background: 'linear-gradient(135deg, #008080 0%, #000000 50%, #0000FF 100%)',
          y: backgroundY
        }}
      />

      <motion.nav
        className="fixed left-0 top-0 h-full z-50 bg-gray-800 bg-opacity-90 shadow-lg"
        initial={{ width: '60px' }}
        animate={{ width: isSidebarOpen ? '200px' : '60px' }}
        onHoverStart={() => setIsSidebarOpen(true)}
        onHoverEnd={() => setIsSidebarOpen(false)}
      >
        <ul className="flex flex-col items-center space-y-4 p-4 mt-20">
          {sections.map((section) => (
            <motion.li key={section.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => scrollTo(section.id)}
                className={`text-sm font-medium transition-colors duration-200 flex items-center ${
                  activeSection === section.id ? 'text-teal-400' : 'text-gray-300 hover:text-white'
                }`}
              >
                <section.icon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-2">{section.title}</span>}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <div className="relative z-20 ml-16">
        <section id="hero" ref={el => sectionRefs.current['hero'] = el} className="min-h-screen flex items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2033711-FTLyEx5jnYl2qRsWiigIQ6LMYRv9Lx.png"
              alt="Hammad Ghani"
              className="rounded-full mx-auto mb-8 w-48 h-48"
            />
            <h1 className="text-6xl font-bold mb-4">Hammad Ghani</h1>
            <h2 className="text-2xl mb-8">Fullstack Developer (Frontend-Heavy) | JavaScript Enthusiast</h2>
            <div className="flex justify-center space-x-4">
              <a href="mailto:hammy.pk30@gmail.com" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
                <FaEnvelope size={24} />
              </a>
              <a href="tel:+923151068487" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
                <FaPhone size={24} />
              </a>
              <a href="http://www.linkedin.com/in/syed-muhammad-hammad-ghani" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
                <FaLinkedin size={24} />
              </a>
              <a  href="http://www.github.com/muhammad-hammad" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
                <FaGithub size={24} />
              </a>
            </div>
          </motion.div>
        </section>

        <section id="about" ref={el => sectionRefs.current['about'] = el} className="min-h-screen flex items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold mb-8">About Me</h2>
            <p className="text-lg mb-4">
              Building and scaling robust web-apps for more than 4+ years of experience as a Full-stack
              Engineer (Frontend-Heavy) with ReactJS, TypeScript, Angular, NextJS, NodeJS, ExpressJS,
              and SQL in Agile environments. I have led teams, maintained code quality, ensured
              productivity, and delivered projects on time.
            </p>
            <p className="text-lg">
              Based in Karachi, Pakistan, I'm passionate about creating efficient and user-friendly web applications.
            </p>
          </motion.div>
        </section>

        <section id="experience" ref={el => sectionRefs.current['experience'] = el} className="min-h-screen py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Work Experience</h2>
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="mb-12 bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                <h4 className="text-xl text-teal-400 mb-2">{exp.company}</h4>
                <p className="text-gray-400 mb-4">{exp.period} | {exp.location}</p>
                <ul className="list-disc list-inside">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx} className="mb-2">{resp}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="skills" ref={el => sectionRefs.current['skills'] = el} className="min-h-screen flex items-center justify-center py-16">
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
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="projects" ref={el => sectionRefs.current['projects'] = el} className="min-h-screen py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Personal Projects</h2>
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="mb-8 bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p>{project.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="certificates" ref={el => sectionRefs.current['certificates'] = el} className="min-h-screen flex items-center justify-center py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Certificates</h2>
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-4 text-lg"
                >
                  {cert}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section id="education" ref={el => sectionRefs.current['education'] = el} className="min-h-screen flex items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-center"
          >
            <h2 className="text-4xl font-bold mb-8">Education</h2>
            <h3 className="text-2xl font-bold mb-2">Bachelors of Engineering</h3>
            <h4 className="text-xl text-teal-400 mb-2">Dawood University of Engineering and Technology Karachi</h4>
            <p className="mb-4">01/2017 - 12/2020 | CGPA 3.23</p>
          </motion.div>
        </section>
      </div>
    </div>
  )
}