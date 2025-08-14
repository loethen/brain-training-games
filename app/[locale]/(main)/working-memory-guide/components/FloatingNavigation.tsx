"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// 浮动导航组件
export function FloatingNavigation() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    
    const sections = [
        { id: "introduction", title: "工作记忆基础", icon: "🧠" },
        { id: "dual-n-back", title: "Dual N-Back训练", icon: "🎯" },
        { id: "schulte-table", title: "Schulte Table训练", icon: "👁️" },
        { id: "memory-improvement", title: "记忆力改善策略", icon: "🔬" },
        { id: "training-protocol", title: "综合训练方案", icon: "📊" },
        { id: "research-evidence", title: "科学研究证据", icon: "📚" }
    ];

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };


    const handleSectionClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        closeNav();
    };

    return (
        <>
            {/* 浮动目录按钮 */}
            <button 
                className="floating-btn"
                onClick={toggleNav}
                title="目录导航"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* 浮动导航面板 */}
            {isNavOpen && (
                <div className="floating-nav-panel fixed bottom-4 right-24 bg-background border rounded-xl shadow-xl p-4 max-w-xs z-[1001]">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">目录导航</h3>
                        <button 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={closeNav}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-1">
                        {sections.map((section) => (
                            <button 
                                key={section.id}
                                onClick={() => handleSectionClick(section.id)}
                                className="flex items-center gap-3 py-2 px-3 text-sm hover:bg-muted rounded-md transition-colors group w-full text-left"
                            >
                                <span className="text-lg">{section.icon}</span>
                                <span className="group-hover:text-primary transition-colors text-xs">
                                    {section.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}