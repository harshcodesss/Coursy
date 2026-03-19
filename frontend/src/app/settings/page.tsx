"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save, LogOut, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/Usercontext";

type SettingsTab = "profile" | "password";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const router = useRouter();

  const { user, setUser } = useUser();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  });
  
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullname || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");

      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax";

      setUser(null);
      
      window.location.href = "/login";
    }
  };

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
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
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
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-zinc-800/50">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      </div>

      <div className="p-6 space-y-4">
        {children}
      </div>

      <div className="px-6 py-4 bg-zinc-950/50 border-t border-zinc-800/50 text-right">
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
      <label htmlFor={name} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="mt-1 block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg shadow-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:opacity-50"
      />
    </div>
  );

  const ProfileSettings = () => {
    const initial = user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U";

    return (
      <SettingsCard
        title="Profile"
        description="This information will be displayed publicly."
        footer={
          <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50">
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
          onChange={() => {}} 
          disabled
        />
        <div>
          <label className="block text-sm font-medium text-zinc-300">
            Avatar
          </label>
          <div className="mt-2 flex items-center gap-4">
            <img
              src={user?.avatar || `https://placehold.co/48x48/000000/FFFFFF?text=${initial}`}
              alt={`${profile.fullName}'s avatar`}
              className="h-12 w-12 rounded-full border border-zinc-800 object-cover"
            />
            <button className="px-4 py-1.5 border border-zinc-700 text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors">
              Change
            </button>
          </div>
        </div>
      </SettingsCard>
    );
  };

  const PasswordSettings = () => (
    <SettingsCard
      title="Password"
      description="Update your password. Make sure to use a strong one."
      footer={
        <button className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50">
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

  return (
    <main className="flex-1 overflow-y-auto bg-zinc-950 text-white p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="mt-2 text-zinc-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <nav className="md:col-span-1">
            <div className="space-y-1">
              <TabButton id="profile" label="Profile" icon={User} />
              <TabButton id="password" label="Password" icon={Lock} />
            </div>
          </nav>

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
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-red-500">Logout Session</h2>
              <p className="mt-1 text-sm text-zinc-400">
                You will be logged out and returned to the login page.
              </p>
              <div className="mt-4 p-6 bg-zinc-900/40 border border-red-500/30 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">End Session</h3>
                  <p className="text-sm text-zinc-400">
                    Log out of your account on this device.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  <LogOut size={16} className="inline-block mr-2 -mt-1" />
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