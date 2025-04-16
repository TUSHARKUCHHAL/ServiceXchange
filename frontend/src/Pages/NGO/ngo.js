import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import './ngo.css';

// Sample NGO data - in a real app this would come from your API
const sampleNGOs = [
  { id: 1, name: "Save The Children", logo: "/api/placeholder/80/80", description: "Supporting children's rights and welfare globally" },
  { id: 2, name: "Habitat for Humanity", logo: "/api/placeholder/80/80", description: "Building homes and communities for those in need" },
  { id: 3, name: "Red Cross", logo: "/api/placeholder/80/80", description: "Providing humanitarian aid during emergencies" },
  { id: 4, name: "World Wildlife Fund", logo: "/api/placeholder/80/80", description: "Preserving wildlife and natural habitats" },
  { id: 5, name: "Doctors Without Borders", logo: "/api/placeholder/80/80", description: "Medical care in crisis regions worldwide" }
];

export default function NGOUserPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // Animation states
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
  }, []);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sampleNGOs.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sampleNGOs.length - 1 : prev - 1));
  };
  
  const handleLoginClick = () => {
    setShowLoginForm(true);
  };
  
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowLoginForm(false);
      // Handle successful login here
    }, 1500);
  };
  
  const handleRegisterClick = () => {
    // Here you would redirect to registration page
    console.log("Redirect to NGO registration page");
  };
  
  return (
    <div className={`bg-white min-h-screen flex flex-col items-center p-6 ${fadeIn ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <header className="w-full max-w-5xl flex justify-between items-center py-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">NGO <span className="text-red-500">Connect</span></h1>
        <div className="flex gap-4">
          <button 
            onClick={handleLoginClick}
            className="flex items-center gap-2 bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300"
          >
            <LogIn size={18} />
            NGO Login
          </button>
          <button 
            onClick={handleRegisterClick}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            <UserPlus size={18} />
            Register NGO
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl">
        {/* Featured NGOs Slider */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured NGOs</h2>
          <div className="relative bg-gray-50 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Discover Organizations Making a Difference</h3>
              <div className="flex gap-2">
                <button 
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white shadow hover:bg-red-50 text-red-500 transition-colors duration-300"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow hover:bg-red-50 text-red-500 transition-colors duration-300"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sampleNGOs.map((ngo) => (
                  <div key={ngo.id} className="min-w-full flex flex-col md:flex-row items-center gap-6 p-4">
                    <div className="bg-white p-4 rounded-xl shadow">
                      <img src={ngo.logo} alt={ngo.name} className="w-20 h-20 object-cover rounded" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{ngo.name}</h4>
                      <p className="text-gray-600 mb-4">{ngo.description}</p>
                      <button className="text-red-500 font-medium hover:text-red-600 transition-colors">
                        Learn More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {sampleNGOs.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentSlide === index ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-red-50 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-red-500 mb-4">Connect</h3>
            <p className="text-gray-700">Find and connect with NGOs that share your mission and vision for a better world.</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-red-500 mb-4">Collaborate</h3>
            <p className="text-gray-700">Work together on impactful projects that help communities and drive sustainable change.</p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-red-500 mb-4">Contribute</h3>
            <p className="text-gray-700">Share resources, knowledge and expertise to maximize your organization's impact.</p>
          </div>
        </section>

        {/* Latest Updates */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Latest Updates</h2>
          <div className="bg-gray-50 rounded-xl p-6 shadow-lg">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-medium text-gray-800">New Partnership Program Launched</h4>
                <p className="text-gray-600 text-sm">Join our new initiative connecting NGOs for collaborative projects.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-medium text-gray-800">Upcoming Virtual Conference</h4>
                <p className="text-gray-600 text-sm">Register for our annual conference featuring speakers from global organizations.</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h4 className="font-medium text-gray-800">Resource Sharing Platform Enhancement</h4>
                <p className="text-gray-600 text-sm">New tools added to help NGOs share and request resources more effectively.</p>
              </div>
            </div>
            <button className="mt-4 text-red-500 font-medium hover:text-red-600 transition-colors">
              View All Updates →
            </button>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">NGO Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-between mb-4">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-red-500 hover:text-red-600">Forgot password?</a>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="w-full max-w-5xl mt-12 py-6 border-t border-gray-200 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} NGO Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}