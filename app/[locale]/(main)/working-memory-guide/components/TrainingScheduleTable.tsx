'use client';

interface TrainingScheduleTableProps {
  className?: string;
}

export function TrainingScheduleTable({ className = "" }: TrainingScheduleTableProps) {
  const scheduleData = [
    {
      level: "初级阶段",
      levelEn: "Beginner",
      weeks: "第1-2周",
      frequency: "每天15-20分钟",
      sessions: "连续14天",
      nBack: "1-back → 2-back",
      focus: "建立基础认知模式",
      expectations: "适应训练节奏，准确率>60%",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      level: "中级阶段", 
      levelEn: "Intermediate",
      weeks: "第3-4周",
      frequency: "每天20-25分钟",
      sessions: "连续14天",
      nBack: "2-back → 3-back",
      focus: "提升工作记忆容量",
      expectations: "流体智力开始提升，准确率>70%",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      level: "高级阶段",
      levelEn: "Advanced", 
      weeks: "第5-6周",
      frequency: "每天25-30分钟",
      sessions: "连续14天",
      nBack: "3-back → 4-back+",
      focus: "巩固训练效果",
      expectations: "显著认知提升，准确率>80%",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ];

  const timelineData = [
    { week: 1, activity: "基础适应", color: "bg-green-500" },
    { week: 2, activity: "技能建立", color: "bg-green-500" },
    { week: 3, activity: "能力提升", color: "bg-blue-500" },
    { week: 4, activity: "效果显现", color: "bg-blue-500" },
    { week: 5, activity: "深度训练", color: "bg-purple-500" },
    { week: 6, activity: "效果巩固", color: "bg-purple-500" }
  ];

  return (
    <div className={`w-full max-w-6xl mx-auto space-y-8 ${className}`}>
      {/* Training Schedule Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-center mb-2">
              科学化工作记忆训练计划
            </h3>
            <p className="text-center text-muted-foreground text-sm">
              基于Jaeggi et al. (2008) 和Au et al. (2015) 研究的最佳训练方案
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
                      <h5 className="font-semibold text-sm mb-2">训练参数</h5>
                      <ul className="text-xs space-y-1">
                        <li><strong>频率：</strong>{phase.frequency}</li>
                        <li><strong>持续：</strong>{phase.sessions}</li>
                        <li><strong>难度：</strong>{phase.nBack}</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm mb-2">训练目标</h5>
                      <p className="text-xs mb-2">{phase.focus}</p>
                      <p className="text-xs"><strong>预期效果：</strong></p>
                      <p className="text-xs">{phase.expectations}</p>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <p className="text-xs mt-2 font-medium">阶段 {index + 1}</p>
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
        <h4 className="font-bold text-lg mb-4 text-center">6周训练时间轴</h4>
        <div className="flex justify-between items-center">
          {timelineData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-4 h-4 rounded-full ${item.color} mb-2`}></div>
              <div className="text-xs font-medium text-center">第{item.week}周</div>
              <div className="text-xs text-muted-foreground text-center mt-1">{item.activity}</div>
              {index < timelineData.length - 1 && (
                <div className="hidden sm:block absolute h-0.5 bg-gray-300 w-full" 
                     style={{
                       left: `${(index + 0.5) * (100 / timelineData.length)}%`,
                       width: `${100 / timelineData.length}%`,
                       top: '8px',
                       zIndex: -1
                     }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Principles */}
      <div className="bg-muted rounded-lg p-6">
        <h4 className="font-bold text-lg mb-4">训练成功的关键原则</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold mb-3 text-amber-700 dark:text-amber-400">🎯 训练原则</h5>
            <ul className="space-y-2 text-sm">
              <li><strong>适应性难度：</strong>根据表现自动调整n-back等级</li>
              <li><strong>渐进式训练：</strong>从简单到复杂，循序渐进</li>
              <li><strong>持续性：</strong>每日训练，避免超过1天间隔</li>
              <li><strong>专注度：</strong>训练时保持高度集中注意力</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">📊 效果监测</h5>
            <ul className="space-y-2 text-sm">
              <li><strong>准确率追踪：</strong>目标维持在60-80%之间</li>
              <li><strong>反应时间：</strong>观察反应速度的改善</li>
              <li><strong>n-back等级：</strong>记录能达到的最高等级</li>
              <li><strong>主观感受：</strong>日常生活中注意力的改善</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h6 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">⚠️ 重要提醒</h6>
          <p className="text-sm text-orange-700 dark:text-orange-300">
            <strong>训练强度控制：</strong>如果准确率持续低于50%，说明难度过高，应降低n-back等级。
            如果准确率持续高于90%，可适当提高难度。最佳训练效果出现在适中挑战性的任务中。
          </p>
        </div>
      </div>

      {/* Scientific Evidence */}
      <div className="text-xs text-muted-foreground bg-background border rounded-lg p-4">
        <h6 className="font-semibold mb-2">科学依据：</h6>
        <ul className="space-y-1">
          <li>• <strong>Jaeggi et al. (2008)</strong>: 19天训练显示流体智力提升40%</li>
          <li>• <strong>Au et al. (2015)</strong>: 元分析证实训练效果的稳定性</li>
          <li>• <strong>Klingberg (2010)</strong>: 确定了最佳训练参数和适应性原则</li>
          <li>• <strong>Melby-Lervåg & Hulme (2013)</strong>: 强调训练一致性的重要性</li>
        </ul>
      </div>
    </div>
  );
}