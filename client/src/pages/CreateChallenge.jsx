import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import toast from 'react-hot-toast';

const CreateChallenge = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wagerAmount: '',
    proofRequirements: '',
    timeframe: 7, // days
    category: 'gaming'
  });
  
  const [loading, setLoading] = useState(false);

  const gameOptions = [
    'League of Legends',
    'Counter-Strike 2',
    'Valorant',
    'Fortnite',
    'Apex Legends',
    'Call of Duty',
    'Rocket League',
    'Chess',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateSkillBasedPolicy = () => {
    const errors = [];
    
    // Check for prohibited content
    const prohibitedTerms = [
      'gambling', 'casino', 'luck', 'random', 'chance', 'lottery', 
      'dice', 'coin flip', 'roulette', 'slot', 'bet on', 'pure chance'
    ];
    
    const textToCheck = `${formData.title} ${formData.description} ${formData.rules}`.toLowerCase();
    const foundProhibited = prohibitedTerms.find(term => textToCheck.includes(term));
    
    if (foundProhibited) {
      errors.push(`Challenge contains prohibited term "${foundProhibited}". SkillWagers only allows skill-based challenges.`);
    }
    
    // Require clear skill demonstration
    if (!formData.proofRequirements || formData.proofRequirements.length < 20) {
      errors.push('Proof requirements must be detailed (minimum 20 characters) to demonstrate skill was required.');
    }
    
    // Require clear rules for skill demonstration
    if (!formData.rules || formData.rules.length < 30) {
      errors.push('Rules must be detailed (minimum 30 characters) to clearly define the skill being tested.');
    }
    
    // Check for clear skill keywords
    const skillKeywords = [
      'skill', 'ability', 'performance', 'achieve', 'demonstrate', 'complete',
      'master', 'practice', 'learn', 'improve', 'technique', 'strategy'
    ];
    
    const hasSkillKeyword = skillKeywords.some(keyword => textToCheck.includes(keyword));
    if (!hasSkillKeyword) {
      errors.push('Challenge should clearly demonstrate skill. Consider including words like "skill", "ability", "performance", or "demonstrate".');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to create a challenge');
      return;
    }

    if (!userProfile?.ageVerified) {
      toast.error('You must verify your age before creating challenges. Go to Profile → Settings to verify your age.');
      return;
    }

    // Validate skill-based policy
    const policyErrors = validateSkillBasedPolicy();
    if (policyErrors.length > 0) {
      policyErrors.forEach(error => toast.error(error));
      return;
    }

    const wagerAmount = parseFloat(formData.wagerAmount);
    if (wagerAmount <= 0) {
      toast.error('Wager amount must be greater than 0');
      return;
    }

    if (wagerAmount > (userProfile?.betaBalance || 0)) {
      toast.error('Insufficient balance for this wager amount');
      return;
    }

    try {
      setLoading(true);

      // Call Cloud Function to create wager
      const createWager = httpsCallable(functions, 'createWager');
      const result = await createWager({
        title: formData.title,
        description: formData.description,
        wagerAmount: wagerAmount,
        category: formData.category,
        proofRequirements: formData.proofRequirements,
        timeframe: formData.timeframe
      });
      
      if (result.data.success) {
        toast.success(`Challenge created! ${wagerAmount} coins escrowed.`);
        navigate(`/challenge/${result.data.challengeId}`);
      } else {
        throw new Error(result.data.message || 'Failed to create challenge');
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error(error.message || 'Failed to create challenge');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-gradient">
            <h1 className="text-2xl font-bold gaming-text mb-6">Create Challenge</h1>
            <p className="text-gray-300">Please log in to create a challenge.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">Create Challenge</h1>
          
          {/* Skill-Based Policy Information */}
          <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Skill-Based Challenge Policy
            </h3>
            <div className="text-sm text-blue-200 space-y-2">
              <p>SkillWagers only allows <strong>skill-based challenges</strong>. Your challenge must:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Test a specific skill, ability, or knowledge</li>
                <li>Have clear, measurable success criteria</li>
                <li>Require practice or expertise to complete</li>
                <li>Include detailed proof requirements</li>
              </ul>
              <p className="text-xs text-blue-300 mt-2">
                <strong>Prohibited:</strong> Gambling, games of chance, luck-based activities, coin flips, dice rolls, or any random outcome challenges.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Challenge Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryAccent"
                placeholder="Enter challenge title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Game
              </label>
              <select
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primaryAccent"
              >
                <option value="">Select a game</option>
                {gameOptions.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Stake Amount (SIM)
              </label>
              <input
                type="number"
                name="wagerAmount"
                value={formData.wagerAmount}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryAccent"
                placeholder="Enter wager amount"
              />
              <p className="text-xs text-gray-400 mt-1">
                Your balance: {userProfile?.betaBalance || 0} SIM
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryAccent resize-vertical"
                placeholder="Describe your challenge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rules
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryAccent resize-vertical"
                placeholder="Define the rules and conditions for winning"
              />
              <p className="text-xs text-gray-400 mt-1">
                Be specific about what skill is being tested and how success is measured. Minimum 30 characters required.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Proof Requirements
              </label>
              <textarea
                name="proofRequirements"
                value={formData.proofRequirements}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryAccent resize-vertical"
                placeholder="What proof is required to validate the win?"
              />
              <p className="text-xs text-gray-400 mt-1">
                Describe what evidence is needed to verify skill demonstration. Screenshots, videos, or other documentation. Minimum 20 characters required.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Creating Challenge...' : 'Create Challenge'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
