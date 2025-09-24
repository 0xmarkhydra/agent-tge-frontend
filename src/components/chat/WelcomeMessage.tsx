import React from 'react';

interface WelcomeMessageProps {
  tokenSlug: string;
  onQuickAction: (action: string) => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  tokenSlug, 
  onQuickAction 
}) => {
  const tokenUpper = tokenSlug.toUpperCase();
  
  const quickActions = [
    {
      label: `What is ${tokenUpper}?`,
      action: `What is ${tokenUpper} and how does it work?`
    },
    {
      label: `Current price`,
      action: `What is the current price of ${tokenUpper}?`
    },
    {
      label: `Tokenomics`,
      action: `What are the tokenomics of ${tokenUpper}?`
    },
    {
      label: `Investors`,
      action: `Who are the investors in ${tokenUpper}?`
    }
  ];

  return (
    <div className="space-y-4">
      {/* Welcome message */}
      <div className="flex justify-start">
        <div className="bg-white rounded-lg p-4 max-w-sm shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-500">Powered by real data</p>
            </div>
          </div>
          
          <p className="text-gray-800 text-sm leading-relaxed">
            Hi! 👋 I'm your AI assistant for <strong>{tokenUpper}</strong>. 
            I can help you with real-time information about this token including 
            price, tokenomics, investors, and more!
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex justify-start">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onQuickAction(action.action)}
                className="px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 shadow-sm"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data source info */}
      <div className="flex justify-start">
        <div className="bg-blue-50 rounded-lg p-3 max-w-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs text-blue-700 font-medium">
              Real-time data from PretgeMarket APIs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
