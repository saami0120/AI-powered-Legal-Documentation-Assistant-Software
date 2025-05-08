// src/components/DocumentGenerator.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FileText,
  ChevronDown,
  Info,
  BookOpen,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Edit,
  Link,
  FileQuestion,
  Code
} from 'lucide-react';
import geminiService from '../services/geminiService';

// Enhanced legal categories
const legalCategories = {
  contracts: {
    label: 'Contracts & Agreements',
    subTypes: ['Service Agreement', 'Non-Disclosure Agreement', 'Employment Contract', 'License Agreement', 'Partnership Agreement'],
    procedures: ['Review & Negotiation', 'Signing & Execution', 'Registration (if required)'],
    risks: ['Unfavorable Terms', 'Ambiguous Language', 'Missing Clauses', 'Legal Conflicts']
  },
  corporate: {
    label: 'Corporate Documents',
    subTypes: ['Articles of Incorporation', 'Bylaws', 'Shareholder Agreement', 'Board Resolutions', 'Minutes of Meeting'],
    procedures: ['Board Approval', 'Filing with Authorities', 'Annual Maintenance'],
    risks: ['Regulatory Non-compliance', 'Governance Issues', 'Shareholder Disputes']
  },
  litigation: {
    label: 'Litigation Documents',
    subTypes: ['Complaint/Petition', 'Legal Notice', 'Affidavit', 'Settlement Agreement', 'Court Filing'],
    procedures: ['Case Analysis', 'Document Preparation', 'Court Submission', 'Service of Process'],
    risks: ['Procedural Errors', 'Missed Deadlines', 'Jurisdictional Issues']
  },
  property: {
    label: 'Property Law',
    subTypes: ['Lease Agreement', 'Property Purchase Agreement', 'Deed Transfer', 'Mortgage Document', 'Easement Agreement'],
    procedures: ['Title Verification', 'Registration', 'Notarization', 'Stamp Duty Payment'],
    risks: ['Ownership Disputes', 'Document Fraud', 'Boundary Issues', 'Regulatory Violations']
  },
  family: {
    label: 'Family Law',
    subTypes: ['Divorce Settlement', 'Child Custody Agreement', 'Will & Testament', 'Power of Attorney', 'Prenuptial Agreement'],
    procedures: ['Mediation', 'Court Filing', 'Document Notarization', 'Asset Documentation'],
    risks: ['Asset Division Disputes', 'Custody Challenges', 'Inheritance Conflicts']
  }
};

// Jurisdictions including Indian states
const jurisdictions = [
  'Federal Law',
  'State Law - California',
  'State Law - New York',
  'State Law - Texas',
  'State Law - Florida',
  'International - EU',
  'International - UK',
  'National Law - India',
  'State Law - Maharashtra (India)',
  'State Law - Uttar Pradesh (India)',
  'State Law - Tamil Nadu (India)',
  'State Law - Delhi (India)',
  'State Law - Karnataka (India)'
];

export default function DocumentGenerator() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [legalReferences, setLegalReferences] = useState([]);
  const [keyClauses, setKeyClauses] = useState([]);
  const [nextSteps, setNextSteps] = useState([]);
  const [activeTab, setActiveTab] = useState('document');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const renderGuidance = () => (
    <div className="glass-effect rounded-xl p-6 mb-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-primary-400" /> Legal Considerations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-dark-300 rounded-lg">
          <h4 className="text-sm font-medium text-primary-400 mb-2">Required Procedures</h4>
          <ul className="list-disc list-inside text-gray-400 text-sm">
            {legalCategories[selectedCategory]?.procedures.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-dark-300 rounded-lg">
          <h4 className="text-sm font-medium text-primary-400 mb-2">Potential Legal Risks</h4>
          <ul className="list-disc list-inside text-gray-400 text-sm">
            {legalCategories[selectedCategory]?.risks.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-dark-300 rounded-lg">
          <h4 className="text-sm font-medium text-primary-400 mb-2">Compliance Checklist</h4>
          <ol className="list-decimal list-inside text-gray-400 text-sm">
            <li>Verify jurisdiction compliance</li>
            <li>Check for required signatories</li>
            <li>Review legal terminology</li>
            <li>Assess enforceability</li>
          </ol>
        </div>
      </div>
    </div>
  );

  const generateDocumentWithGemini = async (data) => {
    setIsAnalyzing(true);
    const docData = {
      category: selectedCategory,
      subType: data.subType,
      jurisdiction: data.jurisdiction,
      fullName: data.fullName,
      counterparty: data.counterparty || '',
      details: data.details
    };
    try {
      const text = await geminiService.generateLegalDocument(docData);
      setGeneratedDocument({ ...docData, generatedText: text, type: data.subType });
      
      const analysis = await geminiService.analyzeLegalDocument(text, docData);
      setAnalysisReport(analysis);
      
      const refs = await geminiService.findRelevantLegalReferences(text, docData);
      setLegalReferences(refs);
      
      const clauses = await geminiService.extractKeyClauses(text);
      setKeyClauses(clauses);
      
      const guidance = await geminiService.provideNextSteps(text, docData);
      setNextSteps(guidance);
      
      setStep(3);
    } catch (e) {
      console.error(e);
      alert(`Error: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = (data) => generateDocumentWithGemini(data);
  const resetForm = () => {
    setStep(1);
    setSelectedCategory(null);
    setGeneratedDocument(null);
    setAnalysisReport(null);
    setLegalReferences([]);
    setKeyClauses([]);
    setNextSteps([]);
    setActiveTab('document');
  };
  const handleDownload = () => {
    if (!generatedDocument) return;
    const blob = new Blob([generatedDocument.generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedDocument.type.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto my-16">
      <div className="glass-effect rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary-400" /> Legal Document Assistant
            </h2>
            <p className="text-gray-400 mt-2">AI-powered document generator for legal professionals</p>
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Object.keys(legalCategories).map(cat => (
              <button key={cat} onClick={() => handleCategorySelect(cat)} className="glass-effect p-6 rounded-xl text-left hover:bg-white/10 transition">
                <h3 className="text-lg font-semibold text-white mb-2">{legalCategories[cat].label}</h3>
                <p className="text-sm text-gray-400 h-16 overflow-hidden">{legalCategories[cat].subTypes.join(', ')}</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <>
            {renderGuidance()}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-200 mb-1 block">Document Type</span>
                  <div className="relative">
                    <select {...register('subType',{ required:true })} className="select-field w-full appearance-none">
                      <option value="">Select document type</option>
                      {legalCategories[selectedCategory].subTypes.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    {errors.subType && <span className="text-red-400 text-xs mt-1 block">Required</span>}
                  </div>
                </label>
                <label className="block">
                  <span className="text-gray-200 mb-1 block">Jurisdiction</span>
                  <div className="relative">
                    <select {...register('jurisdiction',{ required:true })} className="select-field w-full appearance-none">
                      <option value="">Select jurisdiction</option>
                      {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
                    {errors.jurisdiction && <span className="text-red-400 text-xs mt-1 block">Required</span>}
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-gray-200 mb-1 block">Your Full Name/Entity</span>
                  <input type="text" {...register('fullName',{ required:true })} className="input-field w-full" placeholder="Your name or entity"/>
                  {errors.fullName && <span className="text-red-400 text-xs mt-1 block">Required</span>}
                </label>
                <label className="block">
                  <span className="text-gray-200 mb-1 block">Counterparty</span>
                  <input type="text" {...register('counterparty')} className="input-field w-full" placeholder="Other party"/>
                </label>
              </div>
              <label className="block">
                <span className="text-gray-200 mb-1 block">Document Requirements</span>
                <textarea {...register('details',{ required:true })} className="input-field w-full h-32" placeholder="Describe specifics"/>
                {errors.details && <span className="text-red-400 text-xs mt-1 block">Required</span>}
              </label>
              <div className="flex items-center p-3 bg-primary-400/10 rounded-lg">
                <Search className="w-5 h-5 text-primary-400 mr-2"/>
                <span className="text-sm text-gray-300">AI searches relevant precedents and statutes</span>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition">Generate Document</button>
            </form>
          </>
        )}

        {step === 3 && generatedDocument && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Generated {generatedDocument.type}</h3>
              <button onClick={resetForm} className="text-sm text-primary-400 hover:text-primary-300">New Document</button>
            </div>
            <div className="border-b border-gray-700">
              <div className="flex space-x-2">
                {[
                  { key: 'document', icon: FileText, label: 'Document' },
                  { key: 'analysis', icon: AlertTriangle, label: 'Analysis' },
                  { key: 'clauses', icon: Code, label: 'Key Clauses' },
                  { key: 'references', icon: Link, label: 'Legal References' },
                  { key: 'guidance', icon: Info, label: 'Next Steps' }
                ].map(({key,icon:Icon,label}) => (
                  <button key={key} onClick={() => setActiveTab(key)} className={`py-2 px-4 text-sm font-medium flex items-center gap-1 ${activeTab===key ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-gray-300'}`}>
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === 'document' && (
              <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
                <pre className="whitespace-pre-wrap text-sm">{generatedDocument.generatedText}</pre>
              </div>
            )}
            {activeTab === 'analysis' && analysisReport && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-400"/>Analysis Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4"><div className="flex justify-between mb-1"><span className="text-gray-300 text-sm">Compliance Score</span><span className="text-white font-medium">{analysisReport.complianceScore}%</span></div>
                    <div className="w-full bg-dark-300 rounded-full h-2"><div className="bg-primary-400 h-2 rounded-full" style={{width:`${analysisReport.complianceScore}%`}}/></div></div>
                    <h4 className="text-sm font-medium text-white mb-2">Issues</h4>
                    <ul className="space-y-2">{analysisReport.risks.map((r,i)=><li key={i} className="flex items-start"><AlertTriangle className={`w-4 h-4 mr-2 ${r.severity==='high'?'text-red-400':r.severity==='medium'?'text-yellow-400':'text-blue-400'}`}/><span className="text-gray-300 text-sm">{r.description}</span></li>)}</ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Recommendations</h4>
                    <ul className="space-y-2 mb-4">{analysisReport.recommendations.map((rec,i)=><li key={i} className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-primary-400"/><span className="text-gray-300 text-sm">{rec}</span></li>)}</ul>
                    <h4 className="text-sm font-medium text-white mb-2">References</h4>
                    <ul className="space-y-2">{analysisReport.relevantCases.map((c,i)=><li key={i} className="flex items-start"><Clock className="w-4 h-4 mr-2 text-gray-400"/><div><span className="text-primary-300 text-sm">{c.name}</span><p className="text-gray-400 text-xs">{c.relevance}</p></div></li>)}</ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'clauses' && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-primary-400"/>Key Clauses</h3>
                {keyClauses.length>0 ? keyClauses.map((c,i)=><div key={i} className="p-4 bg-dark-300 rounded-lg mb-4"><h4 className="text-primary-300 font-medium">{c.title}</h4><p className="text-gray-300 text-sm">{c.summary}</p><p className="text-gray-400 text-xs italic mt-2">Importance: {c.importance}</p></div>) : <div className="text-center text-gray-400">No clauses found</div>}
              </div>
            )}
            {activeTab === 'references' && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-400" /> Legal References
                </h3>
                <div className="space-y-4">
                  {legalReferences.map((ref, index) => (
                    <div key={index} className="bg-dark-300 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ref.type === 'statute' ? 'bg-blue-500/20 text-blue-400' :
                          ref.type === 'case' ? 'bg-green-500/20 text-green-400' :
                          ref.type === 'regulation' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {ref.type.toUpperCase()}
                        </span>
                        <h4 className="text-lg font-medium text-white">{ref.name}</h4>
                      </div>
                      <p className="text-gray-300 mb-2">{ref.description}</p>
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Applicability:</span> {ref.applicability}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'guidance' && (
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-400" /> Next Steps
                </h3>
                <div className="space-y-4">
                  {nextSteps.map((step, index) => (
                    <div key={index} className="bg-dark-300 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          step.importance === 'high' ? 'bg-red-500/20 text-red-400' :
                          step.importance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {step.importance.toUpperCase()}
                        </span>
                        <span className="text-gray-400">Step {step.step}</span>
                      </div>
                      <h4 className="text-lg font-medium text-white mb-2">{step.action}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{step.timeline}</span>
                      </div>
                      <p className="text-gray-300 mb-4">{step.details}</p>

                      {/* Related Cases Section */}
                      {step.relatedCases && step.relatedCases.length > 0 && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                          <h5 className="text-sm font-medium text-gray-400 mb-3">Related Cases & References</h5>
                          <div className="space-y-3">
                            {step.relatedCases.map((case_, caseIndex) => (
                              <div key={caseIndex} className="bg-dark-400/50 rounded-lg p-3">
                                <div className="flex items-start gap-3">
                                  <Link className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                                  <div className="flex-1">
                                    <a 
                                      href={case_.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary-400 hover:text-primary-300 font-medium block mb-1"
                                    >
                                      {case_.title}
                                    </a>
                                    <p className="text-sm text-gray-400 mb-2">{case_.description}</p>
                                    <p className="text-xs text-gray-500">
                                      <span className="font-medium">Relevance:</span> {case_.relevance}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={handleDownload} className="py-2 px-4 bg-primary-500 text-white rounded-lg flex items-center gap-2 hover:bg-primary-400 transition"><Download className="w-4 h-4"/>Download</button>
              <button onClick={resetForm} className="py-2 px-4 bg-dark-300 text-white rounded-lg hover:bg-dark-200 transition">New Doc</button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <Search className="w-12 h-12 text-primary-400 mb-4"/>
              <h3 className="text-xl font-medium text-white mb-2">Analyzing...</h3>
              <p className="text-gray-400">Searching legal databases and generating document...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
