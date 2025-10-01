import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { 
  TrophyIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect logged-in users to home page
  useEffect(() => {
    if (currentUser) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const features = [
    {
      icon: TrophyIcon,
      title: 'Skill-Based Challenges',
      description: 'Compete in your favorite games and prove your skills against other players.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Escrow',
      description: 'Your stakes are safely held in escrow until challenges are completed.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Real Money Rewards',
      description: 'Win real money by defeating opponents in fair, skill-based competitions.'
    },
    {
      icon: UserGroupIcon,
      title: 'Fair Matchmaking',
      description: 'Our rating system ensures you face opponents of similar skill levels.'
    },
    {
      icon: BoltIcon,
      title: 'Fast Payouts',
      description: 'Instant payouts for games that support it; otherwise up to 24 hours depending on the challenge.'
    },
    {
      icon: StarIcon,
      title: 'Dispute Resolution',
      description: 'Fair and transparent dispute resolution system managed by our admin team.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Players' },
    { value: '$500K+', label: 'Total Payouts' },
    { value: '50,000+', label: 'Challenges Completed' },
    { value: '99.9%', label: 'Dispute Resolution Rate' }
  ];

  const games = [
    'Call of Duty', 'Fortnite', 'Apex Legends', 'FIFA', 'NBA 2K', 'Rocket League'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-gaming py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="gaming-text">Compete.</span> Win. <span className="gaming-text">Earn.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join the ultimate peer-to-peer gaming platform where skill meets reward. 
              Challenge players, prove your abilities, and earn real money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Link to="/marketplace" className="btn-primary text-lg px-8 py-4">
                    Browse Challenges
                  </Link>
                  <Link to="/create-challenge" className="btn-outline text-lg px-8 py-4">
                    Create Challenge
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth" className="btn-primary text-lg px-8 py-4">
                    Get Started
                  </Link>
                  <Link to="/marketplace" className="btn-outline text-lg px-8 py-4">
                    View Challenges
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gaming-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="gaming-text">SkillWagers</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of competitive gaming with our secure, fair, and rewarding platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-gradient group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white ml-4">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Games */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Supported <span className="gaming-text">Games</span>
            </h2>
            <p className="text-xl text-gray-300">
              Challenge players in the most popular competitive games
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map((game, index) => (
              <div 
                key={index}
                className="card text-center hover:shadow-glow transition-all duration-300"
              >
                <div className="text-lg font-semibold text-white">
                  {game}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="gaming-text">Works</span>
            </h2>
            <p className="text-xl text-gray-300">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Create Account
              </h3>
              <p className="text-gray-300">
                Sign up and verify your age to get started. Deposit funds to your wallet.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Find or Create Challenges
              </h3>
              <p className="text-gray-300">
                Browse open challenges or create your own. Stakes are held securely in escrow.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Compete & Win
              </h3>
              <p className="text-gray-300">
                Play your match, submit proof, and get paid instantly when you win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start <span className="gaming-text">Earning</span>?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of gamers already earning money through skill-based competitions.
          </p>
          {!currentUser && (
            <Link to="/auth" className="btn-accent text-lg px-8 py-4 inline-block">
              Join SkillWagers Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;