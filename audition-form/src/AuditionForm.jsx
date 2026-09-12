import { useState } from 'react';
import './AuditionForm.css';
import { db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

/* ── Constants ── */
const DEPARTMENTS = [
  'Computer Science',
  'Electronics and Communication',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
  'Architecture',
  'Metallurgy',
  'Mining',
  'Other',
];

const SKILLSETS = [
  'Vocalist',
  'Instrumentalist',
  'Lyricists',
  'Music Producer',
  'Graphic Designer',
  'Photographer/Videographer',
  'Photo/Video Editors',
];

const TABS = ['Vocalists', 'Instrumentalists', 'Production & Media'];

/* ── Initial form state ── */
const INITIAL_STATE = {
  // Step 1
  fullName: '',
  enrollment: '',
  department: '',
  contact: '',
  email: '',
  skills: [],
  // Step 2 — Vocalists
  vocalGenre: '',
  vocalLanguages: '',
  vocalOriginal: '',
  vocalTraining: '',
  vocalStage: '',
  vocalAchievements: '',
  // Step 2 — Instrumentalists
  instruments: '',
  instrOriginal: '',
  instrTraining: '',
  instrStage: '',
  instrAchievements: '',
  // Step 2 — Production & Media
  prodTools: '',
  prodExperience: '',
  prodAchievements: '',
};

/* ─────────────────────────────────────────────
   Step 1 Component
───────────────────────────────────────────── */
function StepOne({ data, onChange, onNext }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [invalidFields, setInvalidFields] = useState({});

  const toggleSkill = (skill) => {
    const updated = data.skills.includes(skill)
      ? data.skills.filter((s) => s !== skill)
      : [...data.skills, skill];
    onChange('skills', updated);
    if (updated.length > 0) {
      setInvalidFields(prev => ({ ...prev, skills: false }));
      setErrorMsg('');
    }
  };

  const handleFieldChange = (field, value) => {
    onChange(field, value);
    if (value.trim ? value.trim() : value) {
      setInvalidFields(prev => ({ ...prev, [field]: false }));
      setErrorMsg('');
    }
  };

  const handleNext = () => {
    const errors = {};
    const missing = [];

    if (!data.fullName.trim()) {
      errors.fullName = true;
      missing.push('Full Name');
    }
    if (!data.enrollment.trim()) {
      errors.enrollment = true;
      missing.push('Enrollment Number');
    }
    if (!data.department || !data.department.trim()) {
      errors.department = true;
      missing.push('Branch / Department');
    }
    if (!data.contact.trim()) {
      errors.contact = true;
      missing.push('Contact Number');
    }
    const emailVal = data.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      errors.email = true;
      missing.push('Valid Email ID');
    }
    if (data.skills.length === 0) {
      errors.skills = true;
      missing.push('Skillset (at least one)');
    }

    setInvalidFields(errors);

    if (missing.length > 0) {
      setErrorMsg(`Please fill in all compulsory fields marked with * before proceeding: ${missing.join(', ')}`);
      return;
    }

    setErrorMsg('');
    onNext();
  };

  return (
    <>
      <div className="af-grid">
        {/* Full Name */}
        <div className="af-field">
          <label className="af-label">
            Full Name <span className="af-required">*</span>
          </label>
          <input
            className={`af-input ${invalidFields.fullName ? 'is-invalid' : ''}`}
            type="text"
            value={data.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            required
          />
        </div>

        {/* Enrollment */}
        <div className="af-field">
          <label className="af-label">
            Enrollment Number <span className="af-required">*</span>
          </label>
          <input
            className={`af-input ${invalidFields.enrollment ? 'is-invalid' : ''}`}
            type="text"
            value={data.enrollment}
            onChange={(e) => handleFieldChange('enrollment', e.target.value)}
            required
          />
        </div>

        {/* Department / Branch */}
        <div className="af-field">
          <label className="af-label">
            Branch / Department <span className="af-required">*</span>
          </label>
          <select
            className={`af-select ${invalidFields.department ? 'is-invalid' : ''}`}
            value={data.department}
            onChange={(e) => handleFieldChange('department', e.target.value)}
            required
          >
            <option value="" disabled>Select Branch</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Contact */}
        <div className="af-field">
          <label className="af-label">
            Contact Number (WhatsApp) <span className="af-required">*</span>
          </label>
          <input
            className={`af-input ${invalidFields.contact ? 'is-invalid' : ''}`}
            type="tel"
            value={data.contact}
            onChange={(e) => handleFieldChange('contact', e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="af-field af-field--full">
          <label className="af-label">
            Email ID <span className="af-required">*</span>
          </label>
          <input
            className={`af-input ${invalidFields.email ? 'is-invalid' : ''}`}
            type="email"
            value={data.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            required
          />
        </div>

        {/* Skillset */}
        <div className="af-field af-field--full">
          <label className="af-label">
            Select your skillset <span className="af-required">*</span>
          </label>
          <p className="af-hint">Select all that apply.</p>
          <div
            className="af-checkbox-group"
            style={{
              marginTop: '0.5rem',
              border: invalidFields.skills ? '1px solid rgba(192, 57, 43, 0.6)' : 'none',
              padding: invalidFields.skills ? '0.5rem' : '0',
              borderRadius: '2px'
            }}
          >
            {SKILLSETS.map((skill) => (
              <label key={skill} className="af-checkbox-row">
                <input
                  type="checkbox"
                  checked={data.skills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />
                <span className="af-checkbox-label">{skill}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <hr className="af-divider" />

      {errorMsg && (
        <div style={{
          fontSize: '0.8rem',
          color: '#e74c3c',
          background: 'rgba(231, 76, 60, 0.08)',
          border: '1px solid rgba(231, 76, 60, 0.35)',
          padding: '0.6rem 0.85rem',
          borderRadius: '2px',
          marginBottom: '1rem',
          lineHeight: '1.5'
        }}>
          {errorMsg}
        </div>
      )}

      <div className="af-actions" style={{ justifyContent: 'flex-end' }}>
        <button className="af-btn af-btn--primary" onClick={handleNext}>
          Next — Skill Details →
        </button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Step 2 Component
───────────────────────────────────────────── */
function StepTwo({ data, onChange, onBack, onSubmit, isSubmitting }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* Back button */}
      <button className="af-btn af-btn--back" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back
      </button>

      <p className="af-step2-heading">
        <strong>Choose the appropriate section</strong> and fill out the details.{' '}
        (Optional, but highly recommended)
      </p>

      {/* Tabs */}
      <div className="af-tabs">
        <div className="af-tab-list" role="tablist">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === i}
              className={`af-tab-btn ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1 — Vocalists */}
        {activeTab === 0 && (
          <div className="af-tab-panel" role="tabpanel">
            <div className="af-field">
              <label className="af-label">Which genre of music do you prefer?</label>
              <input
                className="af-input"
                type="text"
                value={data.vocalGenre}
                onChange={(e) => onChange('vocalGenre', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">What are the languages you can sing in?</label>
              <input
                className="af-input"
                type="text"
                value={data.vocalLanguages}
                onChange={(e) => onChange('vocalLanguages', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Do you have any original (vocal) compositions?</label>
              <textarea
                className="af-textarea"
                value={data.vocalOriginal}
                onChange={(e) => onChange('vocalOriginal', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Are you currently taking any classes for vocals, or do you have any prior experience of musical training?</label>
              <div className="af-yesno">
                <label className="af-yesno-label">
                  <input
                    type="radio"
                    name="vocalTraining"
                    value="Yes"
                    checked={data.vocalTraining === 'Yes'}
                    onChange={(e) => onChange('vocalTraining', e.target.value)}
                  />
                  <span className="af-yesno-text">Yes</span>
                </label>
                <label className="af-yesno-label">
                  <input
                    type="radio"
                    name="vocalTraining"
                    value="No"
                    checked={data.vocalTraining === 'No'}
                    onChange={(e) => onChange('vocalTraining', e.target.value)}
                  />
                  <span className="af-yesno-text">No</span>
                </label>
              </div>
            </div>
            <div className="af-field">
              <label className="af-label">Do you have any previous experience of performing on stage in front of a large audience?</label>
              <textarea
                className="af-textarea"
                value={data.vocalStage}
                onChange={(e) => onChange('vocalStage', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">List out your music (Vocals) related achievements</label>
              <textarea
                className="af-textarea"
                value={data.vocalAchievements}
                onChange={(e) => onChange('vocalAchievements', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 2 — Instrumentalists */}
        {activeTab === 1 && (
          <div className="af-tab-panel" role="tabpanel">
            <div className="af-field">
              <label className="af-label">Which instrument(s) do you play?</label>
              <input
                className="af-input"
                type="text"
                value={data.instruments}
                onChange={(e) => onChange('instruments', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Do you have any original instrumental compositions?</label>
              <textarea
                className="af-textarea"
                value={data.instrOriginal}
                onChange={(e) => onChange('instrOriginal', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Are you currently taking any classes for your instrument, or do you have any prior experience of musical training?</label>
              <div className="af-yesno">
                <label className="af-yesno-label">
                  <input
                    type="radio"
                    name="instrTraining"
                    value="Yes"
                    checked={data.instrTraining === 'Yes'}
                    onChange={(e) => onChange('instrTraining', e.target.value)}
                  />
                  <span className="af-yesno-text">Yes</span>
                </label>
                <label className="af-yesno-label">
                  <input
                    type="radio"
                    name="instrTraining"
                    value="No"
                    checked={data.instrTraining === 'No'}
                    onChange={(e) => onChange('instrTraining', e.target.value)}
                  />
                  <span className="af-yesno-text">No</span>
                </label>
              </div>
            </div>
            <div className="af-field">
              <label className="af-label">Do you have any previous experience of performing in front of a large audience?</label>
              <textarea
                className="af-textarea"
                value={data.instrStage}
                onChange={(e) => onChange('instrStage', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">List out your music related achievements</label>
              <textarea
                className="af-textarea"
                value={data.instrAchievements}
                onChange={(e) => onChange('instrAchievements', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Tab 3 — Production & Media */}
        {activeTab === 2 && (
          <div className="af-tab-panel" role="tabpanel">
            <p className="af-hint" style={{ marginBottom: '0.25rem' }}>
              Covers: Graphic Designers, Photographers/Videographers, Photo/Video Editors, and Music Producers.
            </p>
            <div className="af-field">
              <label className="af-label">Mention which tools / software / platforms you are well oriented with</label>
              <textarea
                className="af-textarea"
                value={data.prodTools}
                onChange={(e) => onChange('prodTools', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Mention your past experience in this domain</label>
              <textarea
                className="af-textarea"
                value={data.prodExperience}
                onChange={(e) => onChange('prodExperience', e.target.value)}
              />
            </div>
            <div className="af-field">
              <label className="af-label">List out your videography / music production / video related achievements</label>
              <textarea
                className="af-textarea"
                value={data.prodAchievements}
                onChange={(e) => onChange('prodAchievements', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <hr className="af-divider" />

      <div className="af-actions" style={{ justifyContent: 'flex-end' }}>
        <button
          className="af-btn af-btn--primary"
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.65 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Registration ✓'}
        </button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Success Screen
───────────────────────────────────────────── */
function SuccessScreen() {
  return (
    <div className="af-success">
      <div className="af-success-icon">✓</div>
      <p className="af-eyebrow" style={{ margin: 0 }}>Registered</p>
      <h2 className="af-success-title">You're on the list.</h2>
      <p className="af-success-sub">
        Thanks for registering for Octaves auditions. We'll reach out to you on
        WhatsApp / Email with further details. Keep making music.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root Form Component
───────────────────────────────────────────── */
export default function AuditionForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitRegistration = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const docRef = doc(db, 'octaves_auditions_2026', formData.enrollment);
      await setDoc(docRef, {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Firebase submission error:', err);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="af-page">
      <div className="af-card">
        {/* Header */}
        <div className="af-header">
          <p className="af-eyebrow">VNIT Nagpur · Octaves Music Club</p>
          <h1 className="af-title">
            Audition <em>Registration</em>
          </h1>
        </div>

        {/* Step indicator */}
        {!submitted && (
          <div className="af-step-indicator">
            <span className={`af-step-dot ${step >= 1 ? 'active' : ''}`} />
            <span className={`af-step-dot ${step >= 2 ? 'active' : ''}`} />
            <span style={{ marginLeft: '0.25rem' }}>
              Step {step} of 2 — {step === 1 ? 'Basic Information' : 'Skill Details'}
            </span>
          </div>
        )}

        {/* Content */}
        {submitted ? (
          <SuccessScreen />
        ) : step === 1 ? (
          <StepOne
            data={formData}
            onChange={handleChange}
            onNext={() => setStep(2)}
          />
        ) : (
          <>
            <StepTwo
              data={formData}
              onChange={handleChange}
              onBack={() => setStep(1)}
              onSubmit={submitRegistration}
              isSubmitting={isSubmitting}
            />
            {submitError && (
              <p style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                color: '#c0392b',
                textAlign: 'right',
              }}>
                ⚠ {submitError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
