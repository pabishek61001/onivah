import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/App.css';
import LandingPage from './screens/LandingPage';

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Rough from './screens/Rough';
import SearchResults from './screens/SearchResults';
import VendorLayout from './vendor/VendorLayout';
import AddVenue from './vendor/AddVenue';
import Rough2 from './screens/Rough2';
import ContactForm from './screens/ContactForm';
import AboutUs from './screens/AboutUs';
import VendorServices from './vendor/VendorServices';
import VendorformLayout from './vendor/VendorformLayout';
import VendorLogin from './vendor/VendorLogin';
import VendorEmailVerification from './vendorUtils/VendorEmailVerification';
import VendorPassword from './vendorUtils/VendorPassword';
import Blogs from './screens/Blogs';
import ServiceListings from './utils/ServiceListings';
import Rough3 from './screens/rough/Rough3';
import RoughFour from './screens/rough/Rough4';
import Rough5 from './screens/rough/Rough5';
import CheckoutLayout from './utils/CheckoutLayout';
import ProfilePage from './screens/ProfilePage';
import CategoryDetails from './screens/CategoryDetails';


import LoginProtected from './protectedRoutes/LoginprotectedRoute';
import AdminDashboard from './admin/AdminDashboard';
import AdminProtected from './protectedRoutes/AdminProtected';
import AdminLogin from './admin/AdminLogin';
import UsersPage from './admin/UsersPage';


const App = () => {

  const userProtected = (element) => {
    return (
      <LoginProtected>
        {element}
      </LoginProtected>
    );
  };

  const adminProtection = (element) => {
    return (
      <AdminProtected>
        {element}
      </AdminProtected>
    );
  };


  return (
    <GoogleOAuthProvider clientId='339859707035-jf6e5j9dvgsk8dmg5lcddbp2mukkr1jd.apps.googleusercontent.com'>
      <BrowserRouter >
        <Routes >
          <Route path='/' element={<LandingPage />}></Route>
          <Route path='contact' element={<ContactForm />}></Route>
          <Route path='about' element={<AboutUs />}></Route>
          <Route path="search" element={<SearchResults />} />
          <Route path="blogs" element={<Blogs />} />

          <Route path="profile" element={userProtected(<ProfilePage />)} />
          {/* venues */}
          <Route path="category/:service/:serviceId" element={<CategoryDetails />} />
          <Route path="service/:service" element={<ServiceListings />} />
          {/* <Route path="category/:category" element={<ServiceListings />} /> */}

          {/* checkout */}
          <Route path="checkout/:venueId" element={<CheckoutLayout />} />

          {/* vendor services */}
          <Route path="vendor-login" element={<VendorLogin />} />
          <Route path="vendor-services" element={<VendorServices />} />
          <Route path="vendor-services/:profileForm" element={<VendorformLayout />} />
          <Route path="vendor/verify/:token" element={<VendorEmailVerification />} />
          <Route path="vendor/password_setup" element={<VendorPassword />} />

          <Route path="vendor/:id" element={<VendorLayout />} >

            <Route path="add-venue" element={<AddVenue />} />

          </Route>



          {/* admin */}
          <Route path="admin-login" element={<AdminLogin />} />

          <Route path="admin-dashboard" element={adminProtection(<AdminDashboard />)} />
          <Route path="admin-users" element={adminProtection(<UsersPage />)} />


          <Route path='111' element={<Rough />}></Route>
          <Route path='222' element={<Rough2 />}></Route>
          <Route path='333' element={<Rough3 />}></Route>
          <Route path='444' element={<RoughFour />}></Route>
          <Route path='555' element={<Rough5 />}></Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>

  );
}

export default App;
