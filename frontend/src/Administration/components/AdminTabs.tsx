"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// TabContent component
export const TabContent: React.FC<{ tab: Tab; isActive: boolean }> = ({
  tab,
  isActive,
}) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={tab.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab.content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CustomTabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0].id);
  return (
    <div className="w-full  mx-auto text-md">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <TabContent key={tab.id} tab={tab} isActive={activeTab === tab.id} />
        ))}
      </div>
    </div>
  );
};

