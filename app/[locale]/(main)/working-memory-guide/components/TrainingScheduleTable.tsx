'use client';
import { useTranslations } from 'next-intl';

interface TrainingScheduleTableProps {
  className?: string;
}

export function TrainingScheduleTable({ className = "" }: TrainingScheduleTableProps) {
  const t = useTranslations('workingMemoryGuide.scheduleTable');
  const scheduleData = [
    {
      level: t('phases.beginner.level'),
      levelEn: t('phases.beginner.levelEn'),
      weeks: t('phases.beginner.weeks'),
      frequency: t('phases.beginner.frequency'),
      sessions: t('phases.beginner.sessions'),
      nBack: t('phases.beginner.nBack'),
      focus: t('phases.beginner.focus'),
      expectations: t('phases.beginner.expectations'),
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      level: t('phases.intermediate.level'), 
      levelEn: t('phases.intermediate.levelEn'),
      weeks: t('phases.intermediate.weeks'),
      frequency: t('phases.intermediate.frequency'),
      sessions: t('phases.intermediate.sessions'),
      nBack: t('phases.intermediate.nBack'),
      focus: t('phases.intermediate.focus'),
      expectations: t('phases.intermediate.expectations'),
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      level: t('phases.advanced.level'),
      levelEn: t('phases.advanced.levelEn'), 
      weeks: t('phases.advanced.weeks'),
      frequency: t('phases.advanced.frequency'),
      sessions: t('phases.advanced.sessions'),
      nBack: t('phases.advanced.nBack'),
      focus: t('phases.advanced.focus'),
      expectations: t('phases.advanced.expectations'),
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ];

  const timelineData = [
    { week: 1, activity: t('timeline.week1'), color: "bg-green-500" },
    { week: 2, activity: t('timeline.week2'), color: "bg-green-500" },
    { week: 3, activity: t('timeline.week3'), color: "bg-blue-500" },
    { week: 4, activity: t('timeline.week4'), color: "bg-blue-500" },
    { week: 5, activity: t('timeline.week5'), color: "bg-purple-500" },
    { week: 6, activity: t('timeline.week6'), color: "bg-purple-500" }
  ];

  return (
    <div className={`w-full max-w-6xl mx-auto space-y-8 ${className}`}>
      {/* Training Schedule Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-center mb-2">
              {t('title')}
            </h3>
            <p className="text-center text-muted-foreground text-sm">
              {t('subtitle')}
            </p>
          </div>
          
          <div className="space-y-4">
            {scheduleData.map((phase, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-6 ${phase.color} dark:bg-opacity-10`}
              >
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Phase Info */}
                  <div className="md:col-span-1">
                    <h4 className="font-bold text-lg mb-1">{phase.level}</h4>
                    <p className="text-sm opacity-75">{phase.levelEn}</p>
                    <p className="text-sm font-medium mt-2">{phase.weeks}</p>
                  </div>
                  
                  {/* Training Details */}
                  <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-sm mb-2">{t('labels.parameters')}</h5>
                      <ul className="text-xs space-y-1">
                        <li><strong>{t('labels.frequency')}</strong>{phase.frequency}</li>
                        <li><strong>{t('labels.duration')}</strong>{phase.sessions}</li>
                        <li><strong>{t('labels.difficulty')}</strong>{phase.nBack}</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm mb-2">{t('labels.goals')}</h5>
                      <p className="text-xs mb-2">{phase.focus}</p>
                      <p className="text-xs"><strong>{t('labels.expected')}</strong></p>
                      <p className="text-xs">{phase.expectations}</p>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <p className="text-xs mt-2 font-medium">{t('labels.phase')} {index + 1}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Timeline */}
      <div className="bg-card border rounded-lg p-6">
        <h4 className="font-bold text-lg mb-4 text-center">{t('timelineTitle')}</h4>
        <div className="flex justify-between items-center">
          {timelineData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-4 h-4 rounded-full ${item.color} mb-2`}></div>
              <div className="text-xs font-medium text-center">{t('labels.week')}{item.week}</div>
              <div className="text-xs text-muted-foreground text-center mt-1">{item.activity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Principles */}
      <div className="bg-muted rounded-lg p-6">
        <h4 className="font-bold text-lg mb-4">{t('principles.title')}</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">🎯 {t('principles.training')}</h5>
            <ul className="space-y-2 text-sm">
              <li><strong>{t('principles.adaptive')}</strong>{t('principles.adaptiveDesc')}</li>
              <li><strong>{t('principles.progressive')}</strong>{t('principles.progressiveDesc')}</li>
              <li><strong>{t('principles.consistency')}</strong>{t('principles.consistencyDesc')}</li>
              <li><strong>{t('principles.focus')}</strong>{t('principles.focusDesc')}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">📊 {t('monitoring.title')}</h5>
            <ul className="space-y-2 text-sm">
              <li><strong>{t('monitoring.accuracy')}</strong>{t('monitoring.accuracyDesc')}</li>
              <li><strong>{t('monitoring.reaction')}</strong>{t('monitoring.reactionDesc')}</li>
              <li><strong>{t('monitoring.level')}</strong>{t('monitoring.levelDesc')}</li>
              <li><strong>{t('monitoring.subjective')}</strong>{t('monitoring.subjectiveDesc')}</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h6 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">⚠️ {t('warning.title')}</h6>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            <strong>{t('warning.intensity')}</strong>{t('warning.intensityDesc')}
          </p>
        </div>
      </div>

      {/* Scientific Evidence */}
      <div className="text-xs text-muted-foreground bg-background border rounded-lg p-4">
        <h6 className="font-semibold mb-2">{t('evidence.title')}</h6>
        <ul className="space-y-1">
          <li>• <strong>Jaeggi et al. (2008)</strong>: {t('evidence.jaeggi')}</li>
          <li>• <strong>Au et al. (2015)</strong>: {t('evidence.au')}</li>
          <li>• <strong>Klingberg (2010)</strong>: {t('evidence.klingberg')}</li>
          <li>• <strong>Melby-Lervåg & Hulme (2013)</strong>: {t('evidence.melby')}</li>
        </ul>
      </div>
    </div>
  );
}