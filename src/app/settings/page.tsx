"use client";
import { useState, useEffect } from "react";
import { customerApi } from "../../lib/api/customerApi";
import { Customer, CustomerPreferences } from "../../types";

// Define type for dietary restrictions
type DietaryRestrictionType =
  | "Peanut Allergy"
  | "Lactose Intolerance"
  | "Celiac Disease"
  | "Shellfish Allergy"
  | "Diabetes";

export default function SettingsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("notifications");
  const [availableDietaryRestrictions, setAvailableDietaryRestrictions] =
    useState<string[]>([]);

  useEffect(() => {
    loadCustomerProfile();
    loadDietaryRestrictions();
  }, []);

  const loadCustomerProfile = async () => {
    try {
      const response = await customerApi.getCustomerProfile("cust_1");
      if (response.success && response.data) {
        setCustomer(response.data);
      }
    } catch (error) {
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const loadDietaryRestrictions = async () => {
    try {
      const response = await customerApi.getDietaryRestrictions();
      if (response.success) {
        setAvailableDietaryRestrictions(response.data.map((d) => d.name));
      }
    } catch (error) {
      console.error("Failed to load dietary restrictions");
    }
  };

  const handleNotificationChange = (
    updates: Partial<CustomerPreferences["notifications"]>
  ) => {
    if (customer) {
      setCustomer({
        ...customer,
        preferences: {
          ...customer.preferences,
          notifications: {
            ...customer.preferences.notifications,
            ...updates,
          },
        },
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!customer) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await customerApi.updateCustomerProfile(customer.id, {
        preferences: customer.preferences,
      });

      if (response.success) {
        setMessage("Settings updated successfully!");
      } else {
        setMessage("Failed to update settings");
      }
    } catch (error) {
      setMessage("Error updating settings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDietaryRestriction = (restriction: string) => {
    if (!customer) return;

    // Add to local state first
    const currentRestrictions = customer.dietaryRestrictions || [];
    if (!currentRestrictions.includes(restriction)) {
      const newRestrictions = [...currentRestrictions, restriction];
      setCustomer({
        ...customer,
        dietaryRestrictions: newRestrictions,
      });

      // Update preferences to include the new restriction
      const newDietaryPreferences = [...customer.preferences.dietary];
      if (
        !newDietaryPreferences.includes(
          restriction.toLowerCase().replace(" ", "-")
        )
      ) {
        newDietaryPreferences.push(restriction.toLowerCase().replace(" ", "-"));
      }

      handlePreferenceChange({ dietary: newDietaryPreferences });
      setMessage(`Added "${restriction}" to your dietary restrictions`);
    }
  };

  const handleRemoveDietaryRestriction = (restriction: string) => {
    if (!customer) return;

    const newRestrictions =
      customer.dietaryRestrictions?.filter((r) => r !== restriction) || [];
    const newDietaryPreferences = customer.preferences.dietary.filter(
      (p) => p !== restriction.toLowerCase().replace(" ", "-")
    );

    setCustomer({
      ...customer,
      dietaryRestrictions: newRestrictions,
      preferences: {
        ...customer.preferences,
        dietary: newDietaryPreferences,
      },
    });

    setMessage(`Removed "${restriction}" from your dietary restrictions`);
  };

  const handlePreferenceChange = (updates: Partial<CustomerPreferences>) => {
    if (customer) {
      setCustomer({
        ...customer,
        preferences: {
          ...customer.preferences,
          ...updates,
        },
      });
    }
  };

  const handleSetSpecialRequirements = async (requirements: string) => {
    if (!customer) return;

    try {
      // Use the correct API method - update customer profile with special requirements
      const response = await customerApi.updateCustomerProfile(customer.id, {
        preferences: {
          ...customer.preferences,
          specialRequirements: requirements,
        },
      });

      if (response.success && response.data) {
        setCustomer(response.data);
        setMessage("Special requirements updated!");
      }
    } catch (error) {
      setMessage("Failed to update special requirements");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-6">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 text-center">
            <h1 className="text-4xl font-bold mb-4 theme-accent">
              Settings Not Found
            </h1>
            <p>Unable to load customer settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30">
          <h1 className="text-4xl font-bold mb-8 theme-accent">Settings</h1>

          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.includes("success") ||
                message.includes("Added") ||
                message.includes("Removed") ||
                message.includes("updated")
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 p-1 bg-white/5 rounded-lg">
            {[
              { id: "notifications", name: "Notifications", icon: "🔔" },
              { id: "dietary", name: "Dietary", icon: "🥗" },
              { id: "privacy", name: "Privacy", icon: "🔒" },
              { id: "account", name: "Account", icon: "👤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-all duration-300 flex-1 justify-center ${
                  activeTab === tab.id
                    ? "theme-accent bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm opacity-80">
                        Receive order updates and promotions via email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customer.preferences.notifications.email}
                        onChange={(e) =>
                          handleNotificationChange({ email: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:theme-accent"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="font-semibold">SMS Notifications</h3>
                      <p className="text-sm opacity-80">
                        Receive order updates via SMS text messages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customer.preferences.notifications.sms}
                        onChange={(e) =>
                          handleNotificationChange({ sms: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:theme-accent"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Push Notifications</h3>
                      <p className="text-sm opacity-80">
                        Receive real-time order updates on your device
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customer.preferences.notifications.push}
                        onChange={(e) =>
                          handleNotificationChange({ push: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:theme-accent"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Dietary Tab */}
            {activeTab === "dietary" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Dietary Restrictions & Requirements
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">
                      Current Dietary Restrictions
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {customer.dietaryRestrictions?.map((restriction) => (
                        <span
                          key={restriction}
                          className="px-3 py-1 bg-theme-accent/20 text-theme-accent rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{restriction}</span>
                          <button
                            onClick={() =>
                              handleRemoveDietaryRestriction(restriction)
                            }
                            className="text-theme-accent hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {(!customer.dietaryRestrictions ||
                        customer.dietaryRestrictions.length === 0) && (
                        <p className="text-sm opacity-80">
                          No dietary restrictions added yet.
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <select
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            handleAddDietaryRestriction(value);
                            e.target.value = "";
                          }
                        }}
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-current"
                      >
                        <option value="">Add restriction...</option>
                        {availableDietaryRestrictions.map((restriction) => (
                          <option key={restriction} value={restriction}>
                            {restriction}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Special Requirements</h3>
                    <textarea
                      value={customer.preferences.specialRequirements || ""}
                      onChange={(e) => {
                        setCustomer({
                          ...customer,
                          preferences: {
                            ...customer.preferences,
                            specialRequirements: e.target.value,
                          },
                        });
                      }}
                      onBlur={(e) =>
                        handleSetSpecialRequirements(e.target.value)
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-current"
                      rows={4}
                      placeholder="Any special requirements for your orders (e.g., 'Severe nut allergy - please ensure no cross-contamination')"
                    />
                    <p className="text-sm opacity-80 mt-2">
                      These requirements will be included with every order you
                      place.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Privacy & Data</h2>
                <div className="space-y-4">
                  <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Download My Data</h3>
                      <p className="text-sm opacity-80">
                        Export all your personal data and order history
                      </p>
                    </div>
                    <span>📥</span>
                  </button>

                  <button className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Clear Search History</h3>
                      <p className="text-sm opacity-80">
                        Remove all your recent searches
                      </p>
                    </div>
                    <span>🗑️</span>
                  </button>

                  <button className="w-full text-left p-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Delete Account</h3>
                      <p className="text-sm">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <span>⚠️</span>
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Change Password</h3>
                      <p className="text-sm opacity-80">
                        Update your account password for security
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm opacity-80">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300">
                      Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Login Activity</h3>
                      <p className="text-sm opacity-80">
                        View recent login attempts and sessions
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300">
                      View
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4 mt-8 pt-8 border-t border-white/20">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="theme-button px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
            <button
              onClick={loadCustomerProfile}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300"
            >
              Reset Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
