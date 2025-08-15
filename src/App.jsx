import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx'; // if you created it
import Domestic from './pages/Domestic.jsx';
import International from './pages/International.jsx';
import Pilgrimage from './pages/Pilgrimage.jsx';
import GroupTrip from './pages/GroupTrip.jsx';
import Navbar from './components/Navbar.jsx'; // if you want it globally

export default function App() {
return (
<>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/domestic" element={<Domestic />} />
<Route path="/international" element={<International />} />
<Route path="/pilgrimage" element={<Pilgrimage />} />
<Route path="/group-trip" element={<GroupTrip />} />
</Routes>
</>
);
}