/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { customerApi } from "../../lib/api/customerApi";
import { Customer, CustomerPreferences } from "../../types";

export default function ProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCustomerProfile();
  }, []);

  const loadCustomerProfile = async () => {
    try {
      const response = await customerApi.getCustomerProfile("cust_1");
      if (response.success && response.data) {
        setCustomer(response.data);
      }
    } catch (error) {
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    setSaving(true);
    setMessage("");

    try {
      const response = await customerApi.updateCustomerProfile(customer.id, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        preferences: customer.preferences,
      });

      if (response.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile");
      }
    } catch (error) {
      setMessage("Error updating profile");
    } finally {
      setSaving(false);
    }
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
              Profile Not Found
            </h1>
            <p>Unable to load customer profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSaveProfile}>
          <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30">
            <h1 className="text-4xl font-bold mb-8 theme-accent">Profile</h1>

            {message && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  message.includes("success")
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-red-500/20 border border-red-500/30 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-current"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) =>
                        setCustomer({ ...customer, email: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-current"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) =>
                        setCustomer({ ...customer, phone: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-current"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Loyalty Points
                    </label>
                    <div className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3">
                      <span className="text-theme-accent font-semibold">
                        {customer.loyaltyPoints}
                      </span>{" "}
                      points
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  Dietary Preferences
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      "vegetarian",
                      "vegan",
                      "gluten-free",
                      "dairy-free",
                      "nut-free",
                      "low-sodium",
                      "keto",
                      "halal",
                    ].map((preference) => (
                      <label
                        key={preference}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={customer.preferences.dietary.includes(
                            preference
                          )}
                          onChange={(e) => {
                            const newDietary = e.target.checked
                              ? [...customer.preferences.dietary, preference]
                              : customer.preferences.dietary.filter(
                                  (p) => p !== preference
                                );
                            handlePreferenceChange({ dietary: newDietary });
                          }}
                          className="rounded theme-accent"
                        />
                        <span className="capitalize">
                          {preference.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spice Preference */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Spice Preference
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(["mild", "medium", "hot", "extra_hot"] as const).map(
                    (level) => (
                      <label
                        key={level}
                        className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        <input
                          type="radio"
                          name="spiceLevel"
                          checked={
                            customer.preferences.spicePreference === level
                          }
                          onChange={() =>
                            handlePreferenceChange({ spicePreference: level })
                          }
                          className="theme-accent"
                        />
                        <span className="capitalize">
                          {level.replace("_", " ")}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Delivery Preferences */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Delivery Preferences
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Delivery Instructions
                    </label>
                    <textarea
                      value={customer.preferences.deliveryInstructions || ""}
                      onChange={(e) =>
                        handlePreferenceChange({
                          deliveryInstructions: e.target.value,
                        })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-current"
                      rows={3}
                      placeholder="e.g., Leave at door, don't ring bell..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Cutlery Preference
                      </label>
                      <select
                        value={customer.preferences.cutleryPreference}
                        onChange={(e) =>
                          handlePreferenceChange({
                            cutleryPreference: e.target.value as
                              | "include"
                              | "do_not_include"
                              | "ask_each_time",
                          })
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-current"
                      >
                        <option value="include">Always Include</option>
                        <option value="do_not_include">Don't Include</option>
                        <option value="ask_each_time">Ask Each Time</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
                      <input
                        type="checkbox"
                        checked={customer.preferences.contactlessDelivery}
                        onChange={(e) =>
                          handlePreferenceChange({
                            contactlessDelivery: e.target.checked,
                          })
                        }
                        className="rounded theme-accent"
                      />
                      <span>Prefer Contactless Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="theme-button px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={loadCustomerProfile}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
