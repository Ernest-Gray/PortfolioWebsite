import About from './components/About'
import ChatWidget from './components/ChatWidget'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Hobbies from './components/Hobbies'
import Navbar from './components/Navbar'
import ProjectCards from './components/ProjectCards'
import SiteShowcase from './components/SiteShowcase'
import Skills from './components/Skills'
import Timeline from './components/Timeline'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <ProjectCards />
        <SiteShowcase />
        <Hobbies />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
