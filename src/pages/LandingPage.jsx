import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Club-Specific Communities',
      description: 'Join dedicated fan communities for your favorite clubs. Connect with like-minded supporters and share your passion.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Live Match Discussions',
      description: 'Engage in real-time discussions during matches. Share your thoughts, celebrate goals, and analyze plays with fellow fans.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'Latest Updates & News',
      description: 'Stay informed with the latest club news, transfer rumors, match schedules, and player updates all in one place.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      title: 'Fan Events & Meetups',
      description: 'Discover and join local fan events, watch parties, and meetups to connect with supporters in your area.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      text: "FootballConnect has transformed how I experience matches. The live discussions are incredible!",
      author: "Alex Martinez",
      club: "Real Madrid Fan",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      text: "Found an amazing community of fellow supporters. The match events are always exciting!",
      author: "Sarah Johnson",
      club: "Liverpool Fan",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      text: "Best platform for staying updated with club news and connecting with true fans.",
      author: "Mike Thompson",
      club: "Manchester United Fan",
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div 
        className="relative py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 opacity-70"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Where Football{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Unites Fans
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join the ultimate football community where fans come together to celebrate the beautiful game.
          </motion.p>

          <motion.p 
            className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Experience live match discussions, connect with fellow supporters, and never miss a moment
            of your club's journey. Your passion for football finds its home here.
          </motion.p>

          {!user && (
            <motion.div 
              className="space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/login" 
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 
                           text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 
                           rounded-lg hover:from-green-600 hover:to-green-700 text-lg transform 
                           hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="py-12 bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-bold text-blue-600">50K+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Active Users</p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-bold text-blue-600">100+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Fan Communities</p>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-4xl font-bold text-blue-600">1000+</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Daily Discussions</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
            variants={itemVariants}
          >
            Why Join FootballConnect?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 
                           p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300
                           transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div 
        className="py-16 bg-gray-50 dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Fan Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.club}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Your Global Football Family
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Unite with supporters worldwide, share your passion, and be part of every 
            thrilling moment with your favorite club.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg 
                     text-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            Get Started Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage; 