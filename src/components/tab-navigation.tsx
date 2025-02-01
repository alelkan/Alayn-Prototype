"use client";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-4 border-b border-white/10 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 ${
            activeTab === tab.id
              ? "text-accent border-b-2 border-accent"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 