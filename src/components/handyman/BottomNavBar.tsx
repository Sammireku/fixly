import React from 'react';
import { Home, Calendar, Wallet, User } from 'lucide-react';
import { BottomTabId } from './types';

interface BottomNavBarProps {
  activeTab: BottomTabId;
  onTabChange: (tab: BottomTabId) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as BottomTabId, label: 'Home', icon: Home },
    { id: 'bookings' as BottomTabId, label: 'Bookings', icon: Calendar },
    { id: 'wallet' as BottomTabId, label: 'Wallet', icon: Wallet },
    { id: 'account' as BottomTabId, label: 'Account', icon: User },
  ];

  return (
    <div className="bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-between shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors group flex-1"
          >
            <Icon
              className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                isActive ? 'text-[#1E5BF0] stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
              }`}
            />
            <span
              className={`text-[10px] font-medium tracking-tight ${
                isActive ? 'text-[#1E5BF0] font-semibold' : 'text-slate-400'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
