import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

import './css/App.css';
import LandingPage from './screens/LandingPage';



import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Rough from './screens/Rough';
import VenueDetails from './screens/VenueDetails';
import SearchResults from './screens/SearchResults';
import VendorLayout from './vendor/VendorLayout';
import AddVenue from './vendor/AddVenue';
import Rough2 from './screens/Rough2';
import ContactForm from './screens/ContactForm';
import AboutUs from './screens/AboutUs';
import VendorServices from './vendor/VendorServices';
import VendorformLayout from './vendor/VendorformLayout';
import VendorLogin from './vendor/VendorLogin';




const App = () => {
  return (
    <GoogleOAuthProvider clientId='339859707035-jf6e5j9dvgsk8dmg5lcddbp2mukkr1jd.apps.googleusercontent.com'>
      <BrowserRouter >
        <Routes >
          <Route path='/' element={<LandingPage />}></Route>
          <Route path='contact' element={<ContactForm />}></Route>
          <Route path='about' element={<AboutUs />}></Route>
          <Route path="search" element={<SearchResults />} />

          {/* venues */}
          <Route path="venue/:venueid" element={<VenueDetails />} />

          {/* vendor services */}
          <Route path="vendor-login" element={<VendorLogin />} />
          <Route path="vendor-services" element={<VendorServices />} />
          <Route path="vendor-services/:profileForm" element={<VendorformLayout />} />

          <Route path="vendor/:id" element={<VendorLayout />} >

            <Route path="add-venue" element={<AddVenue />} />

          </Route>

          <Route path='rough' element={<Rough />}></Route>
          <Route path='111' element={<Rough2 />}></Route>

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>

  );
}

export default App;
