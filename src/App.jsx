import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import International from './pages/International.jsx';
import GroupTrip from './pages/GroupTrip.jsx';
import Domestic from './pages/Domestic.jsx';
import Pilgrimage from './pages/Pilgrimage.jsx';


// Dummy components for other pages
const About = () => <div style={{paddingTop: '80px', textAlign: 'center', minHeight: '100vh', background: '#f5f5f5'}}><h1>About Page - Coming Soon</h1></div>;
const Destination = () => <div style={{paddingTop: '80px', textAlign: 'center', minHeight: '100vh', background: '#f5f5f5'}}><h1>Destination Page - Coming Soon</h1></div>;
const Hotel = () => <div style={{paddingTop: '80px', textAlign: 'center', minHeight: '100vh', background: '#f5f5f5'}}><h1>Hotel Page - Coming Soon</h1></div>;
const Blog = () => <div style={{paddingTop: '80px', textAlign: 'center', minHeight: '100vh', background: '#f5f5f5'}}><h1>Blog Page - Coming Soon</h1></div>;
const Contact = () => <div style={{paddingTop: '80px', textAlign: 'center', minHeight: '100vh', background: '#f5f5f5'}}><h1>Contact Page - Coming Soon</h1></div>;

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/international" element={<International />} />
        <Route path="/domestic" element={<Domestic />} /> 
        <Route path="/pilgrimage" element={<Pilgrimage />} />
        <Route path="/group-trip" element={<GroupTrip />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
