import { useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { learningPaths, certifications } from '../data/mockTraining';
import TrainingProgress from '../components/training/TrainingProgress';
import LearningPaths from '../components/training/LearningPaths';
import ModuleList from '../components/training/ModuleList';
import CertificationCard from '../components/training/CertificationCard';

const tabs = ['Learning Paths', 'Certifications'];

function buildInitialCompleted() {
  const initial = [];
  learningPaths.forEach((path) => {
    const cert = certifications.find((c) => c.pathId === path.id);
    if (cert && cert.status === 'earned') {
      path.modules.forEach((m) => initial.push(m.id));
    }
  });
  return initial;
}

export default function TrainingPage() {
  const [completedModuleIds, setCompletedModuleIds] = useLocalStorage(
    'recast-training-progress',
    buildInitialCompleted()
  );
  const [activeTab, setActiveTab] = useState('Learning Paths');
  const [selectedPath, setSelectedPath] = useState(null);

  const handleToggleComplete = useCallback(
    (moduleId) => {
      setCompletedModuleIds((prev) =>
        prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
      );
    },
    [setCompletedModuleIds]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-recast-navy">Training &amp; Certification</h1>
        <p className="text-sm text-recast-gray-500 mt-1">
          Build your skills and earn certifications
        </p>
      </div>

      <TrainingProgress
        completedModuleIds={completedModuleIds}
        learningPaths={learningPaths}
        certifications={certifications}
      />

      <div className="flex gap-1 bg-recast-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'Certifications') setSelectedPath(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white text-recast-navy shadow-sm'
                : 'text-recast-gray-600 hover:text-recast-navy'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Learning Paths' && !selectedPath && (
        <LearningPaths
          paths={learningPaths}
          completedModuleIds={completedModuleIds}
          onSelectPath={setSelectedPath}
        />
      )}

      {activeTab === 'Learning Paths' && selectedPath && (
        <ModuleList
          path={selectedPath}
          completedModuleIds={completedModuleIds}
          onToggleComplete={handleToggleComplete}
          onBack={() => setSelectedPath(null)}
        />
      )}

      {activeTab === 'Certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              completedModuleIds={completedModuleIds}
              learningPaths={learningPaths}
            />
          ))}
        </div>
      )}
    </div>
  );
}
