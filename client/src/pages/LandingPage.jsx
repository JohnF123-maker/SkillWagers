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
      title: 'Any Skill-Based Challenge',
      description: 'Create competitions for gaming, sports, fitness, art, trivia, or any measurable skill where outcomes depend on ability, not chance.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Escrow',
      description: 'Your stakes are safely held in escrow until challenges are completed and verified.'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Fair Competition Rewards',
      description: 'Win by demonstrating superior skills in transparent, fair competitions with secure payouts.'
    },
    {
      icon: UserGroupIcon,
      title: 'Transparent Matching',
      description: 'Challenge specific opponents or find matches based on skill level and competition type.'
    },
    {
      icon: BoltIcon,
      title: 'Quick Resolution',
      description: 'Fast challenge resolution with proof submission and automated settlement when both parties confirm results.'
    },
    {
      icon: StarIcon,
      title: 'Dispute Resolution',
      description: 'Fair and transparent dispute resolution system managed by our admin team.'
    }
  ];

  const stats = [
    { value: 'Beta', label: 'Current Status' },
    { value: 'Early Access', label: 'Platform Stage' },
    { value: 'Skill-Based', label: 'Competition Type' },
    { value: '18+', label: 'Age Requirement' }
  ];

  const challengeCategories = [
    'Gaming', 'Fitness', 'Sports', 'Trivia', 'Art & Design', 'Programming', 'Music', 'Languages', 'Speed Skills', 'Strategy Games'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-gaming py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Create and Compete in <span className="gaming-text">Any Skill-Based Challenge</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
              Turn any skill into a fair, wager-based competition. Whether it's gaming mastery, athletic prowess, 
              artistic talent, trivia knowledge, or any other measurable ability—challenge others and prove your expertise.
            </p>
            <div className="bg-dark-700 rounded-lg p-6 mb-8 max-w-3xl mx-auto border border-gray-600">
              <p className="text-gray-300 text-lg italic mb-2">Example Challenge:</p>
              <p className="text-white text-base">
                "Challenge someone to a push-up contest for $5 each. Both players record unedited video proof, 
                submit their performance, and the winner takes the pot. SkillWagers ensures fair play and secure handling of every match."
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Link to="/wagers" className="btn-primary text-lg px-8 py-4">
                    Browse Challenges
                  </Link>
                  <Link to="/create-challenge" className="btn-outline text-lg px-8 py-4">
                    Create Challenge
                  </Link>
                </>
              ) : (
                <Link to="/login" className="btn-accent text-lg px-8 py-4 inline-block">
                  Start a Challenge
                </Link>
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
                <div className="text-gray-300 text-sm md:text-base font-medium">
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
              The secure, fair, and transparent platform for any skill-based competition you can imagine.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-gradient group transition-colors duration-300">
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

      {/* Challenge Categories */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Challenge <span className="gaming-text">Categories</span>
            </h2>
            <p className="text-xl text-gray-300">
              Compete in any skill-based category where talent and practice determine the winner
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {challengeCategories.map((category, index) => (
              <div 
                key={index}
                className="card text-center transition-colors duration-300"
              >
                <div className="text-lg font-semibold text-white">
                  {category}
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
              Simple steps to start competing and earning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Create a Challenge
              </h3>
              <p className="text-gray-300">
                Set up a skill-based challenge and choose your wager amount. Define clear rules and proof requirements.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Find an Opponent
              </h3>
              <p className="text-gray-300">
                Invite specific opponents or accept open challenges. Stakes are securely held in escrow.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Submit Proof
              </h3>
              <p className="text-gray-300">
                Complete your challenge and submit evidence (recordings, screenshots, or other proof as required).
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Automatic Settlement
              </h3>
              <p className="text-gray-300">
                Once both players confirm results, wagers are settled automatically and winnings distributed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-gaming">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our <span className="gaming-text">Beta</span>?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Be among the first to test our skill-based competition platform and help shape its future.
          </p>
          {!currentUser && (
            <Link to="/login" className="btn-accent text-lg px-8 py-4 inline-block">
              Join SkillWagers Today
            </Link>
          )}
          <div className="mt-8 p-4 bg-dark-700 rounded-lg border border-yellow-500 max-w-2xl mx-auto">
            <p className="text-yellow-300 text-sm font-medium">
              ⚠️ Beta Notice: SkillWagers is currently in Beta. All currency used in this version is simulated and has no real-world value.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;