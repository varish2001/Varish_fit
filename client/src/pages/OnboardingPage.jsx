import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  name: "",
  age: 22,
  heightCm: 170,
  weightKg: 70,
  gender: "male",
  fitnessGoal: "fat_loss",
  experienceLevel: "beginner",
  activityLevel: "moderate",
  dietPreference: "veg"
};

export default function OnboardingPage() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/users/get-started", {
        ...form,
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg)
      });
      completeOnboarding(data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create profile. Ensure backend is running on port 5000 and CORS/API base is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl">
      <div className="glass p-6 md:p-8">
        <h1 className="text-3xl font-bold text-ink">Build Your Fitness Profile</h1>
        <p className="mt-2 text-slate">Tell us your basics and goals. We will personalize everything for you.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(v) => onChange("name", v)} />
          <Input label="Age" type="number" value={form.age} onChange={(v) => onChange("age", v)} />
          <Input label="Height (cm)" type="number" value={form.heightCm} onChange={(v) => onChange("heightCm", v)} />
          <Input label="Weight (kg)" type="number" value={form.weightKg} onChange={(v) => onChange("weightKg", v)} />

          <Select
            label="Gender"
            value={form.gender}
            onChange={(v) => onChange("gender", v)}
            options={[
              ["male", "Male"],
              ["female", "Female"],
              ["other", "Other"]
            ]}
          />
          <Select
            label="Fitness Goal"
            value={form.fitnessGoal}
            onChange={(v) => onChange("fitnessGoal", v)}
            options={[
              ["fat_loss", "Fat Loss"],
              ["muscle_gain", "Muscle Gain"],
              ["maintenance", "Maintenance"],
              ["strength", "Strength"]
            ]}
          />
          <Select
            label="Activity Level"
            value={form.activityLevel}
            onChange={(v) => onChange("activityLevel", v)}
            options={[
              ["light", "Lightly Active"],
              ["moderate", "Moderately Active"],
              ["active", "Very Active"]
            ]}
          />
          <Select
            label="Diet Preference"
            value={form.dietPreference}
            onChange={(v) => onChange("dietPreference", v)}
            options={[
              ["veg", "Veg"],
              ["non_veg", "Non-Veg"]
            ]}
          />
          <div className="md:col-span-2">
            <Select
              label="Experience Level"
              value={form.experienceLevel}
              onChange={(v) => onChange("experienceLevel", v)}
              options={[
                ["beginner", "Beginner"],
                ["intermediate", "Intermediate"],
                ["advanced", "Advanced"]
              ]}
            />
          </div>

          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="md:col-span-2 rounded-xl bg-coral px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate/20 bg-white px-3 py-2 outline-none ring-coral focus:ring-2"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate/20 bg-white px-3 py-2 outline-none ring-coral focus:ring-2"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
