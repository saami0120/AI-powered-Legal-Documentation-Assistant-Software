import React from 'react';
import { Scale, MessageSquare, FileText } from 'lucide-react';
import DocumentGenerator from './components/DocumentGenerator';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 to-dark-100">
      {/* Simplified Navigation */}
      <header className="glass-effect">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className="h-7 w-7 text-primary-400" />
              <span className="text-xl font-light text-gray-300">LegalDoc</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/validate')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 transition"
              >
                <FileText className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">Validate Document</span>
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 transition"
              >
                <MessageSquare className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">Chat with AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Text Fix */}
      <main className="max-w-7xl mx-auto px-8">
        <div className="min-h-[calc(90vh + 2rem)] flex items-center justify-center pb-12"> {/* Added padding-bottom */}
          <div className="text-center space-y-8 max-w-2xl">
            <div className="space-y-6">
              <h1 className="text-7xl font-bold gradient-text leading-tight pb-2"> {/* Added padding-bottom */}
                Stop Fighting<br />
                <span className="inline-block pt-2">Legal Documents</span> {/* Adjusted line spacing */}
              </h1>
              
              <p className="text-xl text-gray-300 mt-8 px-4"> {/* Increased margin-top */}
                Create perfect legal documents through simple conversation
              </p>
            </div>
          </div>
        </div>

        <DocumentGenerator />
      </main>

      {/* Simplified Footer */}
      <footer className="glass-effect mt-32 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 LegalDoc. Empowering everyone with legal clarity.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;