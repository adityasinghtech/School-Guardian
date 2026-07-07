import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, BarChart3, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-slate-900 tracking-tight">School Guardian</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                Log in
              </Link>
              <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors shadow-sm">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[75vh]">
          <div className="absolute top-0 w-full h-full bg-slate-50 overflow-hidden z-0">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/demo/image/upload/sample.jpg')] bg-cover bg-center opacity-10"></div>
          </div>
          <div className="container relative mx-auto z-10 px-4">
            <div className="items-center flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                <div className="pr-12">
                  <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Modern Facility Condition Reporting
                  </h1>
                  <p className="mt-4 text-lg text-slate-600">
                    A centralized portal to report, track, and resolve infrastructure issues efficiently. Ensuring a safe and secure environment for our students.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/register-school" className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl text-center">
                      Register Your School
                    </Link>
                    <Link to="/register" className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-50 transition-colors shadow-sm text-center">
                      Join Existing School
                    </Link>
                    <Link to="/login" className="bg-slate-800 text-white border border-slate-700 px-6 py-3 rounded-md font-medium text-lg hover:bg-slate-900 transition-colors shadow-sm text-center">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="pb-20 bg-white -mt-24 relative z-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              {/* Feature 1 */}
              <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-xl border border-slate-100 transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-md rounded-full bg-blue-500">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h6 className="text-xl font-semibold text-slate-900">Real-time Tracking</h6>
                    <p className="mt-2 mb-4 text-slate-600">
                      Monitor the status of your reports from pending to resolved with instant notifications.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-xl border border-slate-100 transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-md rounded-full bg-emerald-500">
                      <Users className="w-6 h-6" />
                    </div>
                    <h6 className="text-xl font-semibold text-slate-900">Role-based Access</h6>
                    <p className="mt-2 mb-4 text-slate-600">
                      Tailored dashboards for Parents, Teachers, and Administrators to streamline workflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-xl border border-slate-100 transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="px-4 py-5 flex-auto">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-md rounded-full bg-amber-500">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <h6 className="text-xl font-semibold text-slate-900">Deep Analytics</h6>
                    <p className="mt-2 mb-4 text-slate-600">
                      Generate comprehensive reports and view critical issue metrics at a glance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 pb-6 pt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-slate-400 font-medium py-1">
                © {new Date().getFullYear()} School Guardian. Designed for educational excellence.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
