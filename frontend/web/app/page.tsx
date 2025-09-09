import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-900">MindPath</div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/adhd-assessment" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  ADHD Assessment
                </Link>
                <Link href="/autism-assessment" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Autism Assessment
                </Link>
                <Link href="/psychiatry" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Psychiatry
                </Link>
                <Link href="/therapy" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Therapy
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  About Us
                </Link>
                <Link href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-32 overflow-hidden min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-120"
          style={{
            backgroundImage: 'url(/image.png)',
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-green-50/40"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <div>
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
                Your path to better mental health, guided by experts
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 mb-10">
                By combining advanced technology with expert clinician care, we provide an accessible pathway to diagnosis & aftercare in Ireland.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/adhd-assessment" className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 text-center shadow-lg">
                  ADHD Assessment
                </Link>
                <Link href="/autism-assessment" className="bg-green-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 text-center shadow-lg">
                  Autism Assessment
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mt-6">
                <Link href="/psychiatry" className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 text-center shadow-lg">
                  ADHD Psychiatry
                </Link>
                <Link href="/therapy" className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 text-center shadow-lg">
                  Therapy
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-10">
                <div className="w-40 h-40 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Expert Guidance</h3>
                <p className="text-lg text-gray-600">Professional mental health assessment and support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">PSI Member</div>
              <div className="text-gray-600">Clinicians</div>
            </div>
            <div className="p-6">
              <div className="text-green-600 text-2xl font-bold mb-2">Cost-Effective</div>
              <div className="text-gray-600">Alternative</div>
            </div>
            <div className="p-6">
              <div className="text-blue-600 text-2xl font-bold mb-2">No GP Referral</div>
              <div className="text-gray-600">Required</div>
            </div>
            <div className="p-6">
              <div className="text-green-600 text-2xl font-bold mb-2">HSE-Recognised</div>
              <div className="text-gray-600">Reports</div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome to MindPath</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            MindPath is an online mental health service in Ireland that specialises in Adult ADHD & Autism Assessment, Diagnosis & Aftercare.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fully Online & Nationwide</h3>
              <p className="text-gray-600">Access our services from anywhere in Ireland with our fully online platform.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Certified & Registered Clinicians</h3>
              <p className="text-gray-600">All our clinicians are PSI registered and certified mental health professionals.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Immediate Pre-Assessment</h3>
              <p className="text-gray-600">Start your journey with our scientifically validated pre-assessment today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Assessment Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Immediate Pre-Assessment</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The first step to understanding your symptoms starts with our scientifically validated Pre-Assessment. 
              A Free Follow-Up Call with a clinician is included to discuss your results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border border-blue-200">
              <h3 className="text-2xl font-semibold text-blue-900 mb-4">ADHD Pre-Assessment</h3>
              <p className="text-blue-700 mb-6">Comprehensive ADHD screening using validated assessment tools.</p>
              <Link href="/adhd-assessment" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
                Start ADHD Assessment
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg border border-green-200">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">Autism Pre-Assessment</h3>
              <p className="text-green-700 mb-6">Evidence-based autism screening for adults seeking answers.</p>
              <Link href="/autism-assessment" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block">
                Start Autism Assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How it works</h2>
            <p className="text-xl text-gray-600">Autism and ADHD Assessment in 3 easy steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Assessment</h3>
              <p className="text-gray-600">Complete our scientifically validated online pre-assessment at your own pace.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinical Assessment</h3>
              <p className="text-gray-600">Meet with our qualified clinicians for a comprehensive evaluation and discussion.</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Diagnostic Report</h3>
              <p className="text-gray-600">Receive your comprehensive diagnostic report with personalized recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Pricing Options</h2>
            <p className="text-xl text-gray-600">Mental Health Assessments, Accessible for All</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Pre-Assessment</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">Free</div>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>• Scientifically validated screening</li>
                <li>• Immediate results</li>
                <li>• Free follow-up call</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Get Started
              </button>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-lg border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Assessment</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">€399</div>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>• Comprehensive clinical assessment</li>
                <li>• Detailed diagnostic report</li>
                <li>• Personalized recommendations</li>
                <li>• HSE-recognised report</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                Book Assessment
              </button>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Aftercare Package</h3>
              <div className="text-3xl font-bold text-green-600 mb-4">€199</div>
              <ul className="text-gray-600 mb-6 space-y-2">
                <li>• Psychiatry consultation</li>
                <li>• Therapy sessions</li>
                <li>• Ongoing support</li>
                <li>• Medication management</li>
              </ul>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Technology Section */}
      <section className="bg-gradient-to-br from-blue-900 to-green-800 py-16 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Advanced technology, with expert clinician care</h2>
          <p className="text-xl mb-8 max-w-4xl mx-auto">
            The first step towards understanding your potential condition starts with our scientifically validated Pre-Assessment. 
            Built on leading psychometric tools and rigorously trained by advanced technology, our ADHD & Autism assessments 
            provides a comprehensive analysis of your symptoms.
          </p>
          <Link href="/services" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block">
            Explore our services
          </Link>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Clients Are Saying About Us</h2>
            <p className="text-xl text-gray-600">We have helped thousands of adults across Ireland</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">JD</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">John D.</div>
                  <div className="text-sm text-gray-600">Dublin</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The assessment process was thorough and professional. Finally got the answers I was looking for after years of uncertainty."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">SM</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-600">Cork</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Excellent service from start to finish. The online format made it so accessible and the clinicians were incredibly supportive."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MK</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael K.</div>
                  <div className="text-sm text-gray-600">Galway</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Fast, professional, and affordable. The diagnostic report was comprehensive and helped me understand my condition better."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is MindPath?</h3>
              <p className="text-gray-600">
                MindPath is an online mental health service based in Ireland. We specialise in Adult ADHD care: from online 
                Pre-Assessment and diagnosis to therapy, psychiatry, and aftercare. Everything is done online, privately, and at your own pace.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does the Pre-Assessment work?</h3>
              <p className="text-gray-600">
                Our Pre-Assessment is a scientifically validated online screening tool that takes about 20-30 minutes to complete. 
                You'll answer questions about your symptoms and experiences, and receive immediate results along with a free follow-up call with a clinician.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need a GP referral to start?</h3>
              <p className="text-gray-600">
                No, you don't need a GP referral to access our services. You can start with our Pre-Assessment directly and proceed 
                to a full assessment if recommended by our clinicians.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Are your clinicians qualified?</h3>
              <p className="text-gray-600">
                Yes, all our clinicians are PSI (Psychological Society of Ireland) registered and have extensive experience in 
                ADHD and Autism assessment and treatment. They are fully qualified mental health professionals.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does the Full Assessment take?</h3>
              <p className="text-gray-600">
                The Full Assessment typically takes 2-3 hours and is conducted over video call with one of our qualified clinicians. 
                You'll receive your diagnostic report within 5-7 business days.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-6">Explore our comprehensive FAQ section for more detailed information.</p>
            <Link href="/faqs" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
              Explore All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">MindPath</div>
              <p className="text-gray-300 mb-4">
                MindPath is an online mental health service based in Ireland that specialises in ADHD & Autism Assessments & Treatment
              </p>
              <div className="space-y-2">
                <div className="text-gray-300">Suite 1, Waterside Chambers, Waterford</div>
                <div className="text-gray-300">
                  <a href="mailto:info@mindpath.ie" className="hover:text-white">info@mindpath.ie</a>
                </div>
                <div className="text-gray-300">
                  <a href="tel:+35351813207" className="hover:text-white">051-813207</a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/adhd-assessment" className="hover:text-white">ADHD Assessment</Link></li>
                <li><Link href="/autism-assessment" className="hover:text-white">Autism Assessment</Link></li>
                <li><Link href="/psychiatry" className="hover:text-white">Psychiatry</Link></li>
                <li><Link href="/therapy" className="hover:text-white">Therapy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faqs" className="hover:text-white">FAQs</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-300 mb-4 md:mb-0">
                All Rights Reserved 2025 – MindPath
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297-.878-.808-1.297-1.959-1.297-3.326 0-1.297.49-2.448 1.297-3.326.808-.878 1.959-1.297 3.326-1.297 1.297 0 2.448.49 3.326 1.297.878.808 1.297 1.959 1.297 3.326 0 1.297-.49 2.448-1.297 3.326-.808.878-1.959 1.297-3.326 1.297z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">TikTok</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.203-1.79-1.203-1.79s-.354-.941-.354-2.548v-.354h-3.63v12.73c0 .354-.354.708-.708.708s-.708-.354-.708-.708V9.896h-3.63v4.663c0 2.548 2.194 4.74 4.74 4.74s4.74-2.192 4.74-4.74V9.896h3.63c0 1.607.354 2.548.354 2.548s.354.941 1.203 1.79a6.228 6.228 0 001.137.966c.141.089.287.17.443.258v-9.896z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
