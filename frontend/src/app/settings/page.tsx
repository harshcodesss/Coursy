"use client";

import React, { useState } from "react";
import { User, Lock, Save, LogOut, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Import useRouter for logout

// Define tab types
type SettingsTab = "profile" | "password";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const router = useRouter(); // Initialize router

  // State for form inputs (you'll wire this up to your backend)
  const [profile, setProfile] = useState({
    fullName: "Harsh Rathi",
    email: "harsh@example.com",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // --- Logout Function ---
  const handleLogout = async () => {
    // This is where you would call your backend's /api/users/logout endpoint
    console.log("Logging out...");
    // Example fetch:
    // await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
    router.push("/login"); // Redirect to login page
  };

  // --- Reusable Components ---

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: SettingsTab;
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${
        activeTab === id
          ? "bg-neutral-800 text-white"
          : "text-neutral-400 hover:bg-neutral-800/50 hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const SettingsCard = ({
    title,
    description,
    children,
    footer,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
    footer: React.ReactNode;
  }) => (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-neutral-400">{description}</p>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {children}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-neutral-900/50 border-t border-neutral-800 text-right rounded-b-lg">
        {footer}
      </div>
    </div>
  );

  const InputField = ({
    label,
    name,
    type,
    value,
    onChange,
    disabled = false,
  }: {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-neutral-300">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md shadow-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>
  );

  // --- Tab Content Components ---

  const ProfileSettings = () => (
    <SettingsCard
      title="Profile"
      description="This information will be displayed publicly."
      footer={
        <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-colors disabled:opacity-50">
          <Save size={16} className="inline-block mr-2 -mt-1" />
          Save Changes
        </button>
      }
    >
      <InputField
        label="Full Name"
        name="fullName"
        type="text"
        value={profile.fullName}
        onChange={handleProfileChange}
      />
      <InputField
        label="Email Address"
        name="email"
        type="email"
        value={profile.email}
        onChange={() => {}} // Usually email is not changeable
        disabled
      />
      <div>
        <label className="block text-sm font-medium text-neutral-300">
          Avatar
        </label>
        <div className="mt-1 flex items-center gap-4">
          <img
            src="https://placehold.co/48x48/000000/FFFFFF?text=H"
            alt="User avatar"
            className="rounded-full"
          />
          <button className="px-4 py-1.5 border border-neutral-700 text-sm font-medium rounded-md hover:bg-neutral-800">
            Change
          </button>
        </div>
      </div>
    </SettingsCard>
  );

  const PasswordSettings = () => (
    <SettingsCard
      title="Password"
      description="Update your password. Make sure to use a strong one."
      footer={
        <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-colors disabled:opacity-50">
          <Save size={16} className="inline-block mr-2 -mt-1" />
          Update Password
        </button>
      }
    >
      <InputField
        label="Current Password"
        name="current"
        type="password"
        value={passwords.current}
        onChange={handlePasswordChange}
      />
      <InputField
        label="New Password"
        name="new"
        type="password"
        value={passwords.new}
        onChange={handlePasswordChange}
      />
      <InputField
        label="Confirm New Password"
        name="confirm"
        type="password"
        value={passwords.confirm}
        onChange={handlePasswordChange}
      />
    </SettingsCard>
  );

  // --- Main Return ---
  return (
    <main className="flex-1 overflow-y-auto bg-black text-white p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-neutral-400">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Navigation */}
          <nav className="md:col-span-1">
            <div className="space-y-1">
              <TabButton id="profile" label="Profile" icon={User} />
              <TabButton id="password" label="Password" icon={Lock} />
              {/* Theme button removed */}
            </div>
          </nav>

          {/* Content */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile" && <ProfileSettings />}
                {activeTab === "password" && <PasswordSettings />}
                {/* Theme content removed */}
              </motion.div>
            </AnimatePresence>
            
            {/* Logout Section */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-red-500">Logout Session</h2>
              <p className="mt-1 text-sm text-neutral-400">
                You will be logged out and returned to the login page.
              </p>
              <div className="mt-4 p-6 bg-neutral-900 border border-red-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">End Session</h3>
                  <p className="text-sm text-neutral-400">
                    Log out of your account on this device.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors"
                >
                  <LogOut size={16} className="inline-block mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

