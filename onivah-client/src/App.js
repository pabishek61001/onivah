import { useEffect } from 'react';


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
import ScrollToTop from "react-scroll-to-top";


import LoginProtected from './protectedRoutes/LoginprotectedRoute';
import AdminDashboard from './admin/AdminDashboard';
import AdminProtected from './protectedRoutes/AdminProtected';
import AdminLogin from './admin/AdminLogin';
import UsersPage from './admin/UsersPage';
import RequestedServices from './admin/RequestedServices';
import ComposeMail from './admin/ComposeMail';
import InboxPage from './admin/InboxPage';
import ApprovedServices from './admin/ApprovedServices';
import DeclinedServices from './admin/DeclinedServices';
import DeleteService from './admin/DeleteService';
import { FavoritesProvider } from './Favourites/FavoritesContext';
import FavoritesPage from './Favourites/FavoritesPage';
import AdminHome from './admin/AdminHome';
import VendorDashboard from './vendor/VendorDashboard';
import AvailableDates from './vendor/AvailableDates';
import VendorSettings from './vendor/VendorSettings';
// import { ThemeProviderWrapper } from './Themes/ThemeContext';
import { ArrowUpward } from '@mui/icons-material';
import AOS from 'aos';
import 'aos/dist/aos.css'
import BecomeVendor from './screens/BecomeVendor';
import VendorProtected from './vendor/VendorProtected';
import ManageGallery from './vendor/ManageGallery';

const App = () => {

  // ...inside App component
  useEffect(() => {
    AOS.init({
      duration: 1000,         // animation duration
      once: false,            // animations trigger every time on scroll up/down
      mirror: true,           // animate out while scrolling past
      offset: 120,            // offset (in px) from the original trigger point
    });

    AOS.refresh(); // Optional if you dynamically load components
  }, []);

  // Main protected route wrapper
  const userProtected = (element) => {
    return <LoginProtected>{element}</LoginProtected>;
  };

  const adminProtection = (element) => {
    return (
      <AdminProtected>
        {element}
      </AdminProtected>
    );
  };



  const Orders = () => {
    return <h2>Orders Page</h2>;
  };



  return (
    <GoogleOAuthProvider clientId='339859707035-jf6e5j9dvgsk8dmg5lcddbp2mukkr1jd.apps.googleusercontent.com'>
      <FavoritesProvider>

        <ScrollToTop
          smooth
          style={{ borderRadius: 50, }}
          component={<ArrowUpward sx={{ fontSize: 18, color: "#6f00ff", }} />}
        />

        {/* <ThemeProviderWrapper> */}
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
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* checkout */}
            <Route path="checkout/:venueId" element={<CheckoutLayout />} />

            {/* vendor services */}
            <Route path="become-a-vendor" element={<BecomeVendor />} />
            <Route path="vendor-login" element={<VendorLogin />} />
            <Route path="vendor/verify/:token" element={<VendorEmailVerification />} />
            <Route path="vendor/password_setup" element={<VendorPassword />} />





            {/* admin */}
            <Route path="admin-login" element={<AdminLogin />} />

            <Route path="admin-dashboard" element={adminProtection(<AdminDashboard />)}>
              <Route index element={<AdminHome />} /> {/* Default Dashboard Content */}
              <Route path="inbox" element={<InboxPage />} />
              <Route path="compose" element={<ComposeMail />} />
              <Route path="requests" element={<RequestedServices />} />
              <Route path="requests/approved" element={<ApprovedServices />} />
              <Route path="requests/declined" element={<DeclinedServices />} />
              <Route path="requests/delete" element={<DeleteService />} />
            </Route>
            <Route path="admin-users" element={adminProtection(<UsersPage />)} />


            {/* vendor */}
            <Route path="vendor-dashboard" element={<VendorProtected><VendorLayout /></VendorProtected>}>
              <Route index element={<VendorDashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="vendor-services" element={<VendorServices />} />
              <Route path="vendor-services/:profileForm" element={<VendorformLayout />} />
              <Route path="settings" element={<VendorSettings />} />
              <Route path="manage-gallery" element={<ManageGallery />} />
              <Route path="available-dates" element={<AvailableDates />} />
            </Route>

            <Route path='111' element={<Rough />}></Route>
            <Route path='222' element={<Rough2 />}></Route>
            <Route path='333' element={<Rough3 />}></Route>
            <Route path='444' element={<RoughFour />}></Route>
            <Route path='555' element={<Rough5 />}></Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>

      {/* </ThemeProviderWrapper> */}
    </GoogleOAuthProvider>

  );
}

export default App;
