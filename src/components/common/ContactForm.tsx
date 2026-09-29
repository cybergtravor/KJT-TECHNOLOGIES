/**
 * =====================================================================
 * CONTACT FORM COMPONENT - KJT TECHNOLOGIES (Geometric Balance Theme)
 * =====================================================================
 * Features:
 * - Full Name, Email, Phone Number, Service Required (Dropdown), Subject, Message
 * - Honeypot spam prevention field (botcheck)
 * - Direct Web3Forms integration via environment variable or companyConfig
 * - Comprehensive client-side validation and responsive submission states
 * =====================================================================
 */

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { companyConfig } from '../../config/company';
import { servicesData } from '../../data/servicesData';
import { WhatsAppButton } from './WhatsAppButton';

interface ContactFormProps {
  defaultService?: string;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  defaultService = '',
  className = '',
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: defaultService || servicesData[0]?.title || 'Website Design and Development',
    subject: defaultService ? `Inquiry regarding ${defaultService}` : '',
    message: '',
    consent: false,
    // Honeypot field - must stay empty
    botcheck: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const accessKey =
    ((import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string) ||
    companyConfig.contactFormKey;

  const isKeyConfigured =
    accessKey &&
    !accessKey.includes('YOUR_WEB3FORMS') &&
    accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your corporate or personal email';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please provide a valid contact or WhatsApp phone number';
    } else if (phoneDigits.length < 7) {
      newErrors.phone = 'Please enter a valid phone number with at least 7 digits';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please provide a subject for your message';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your project or inquiry';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide at least 10 characters describing your request';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to the privacy policy to submit your inquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot validation: if bot filled this hidden field, silently reject
    if (formData.botcheck) {
      console.warn('Bot detected via honeypot field.');
      setStatus('success');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      if (isKeyConfigured) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `[KJT Inquiry] ${formData.subject} - from ${formData.fullName}`,
            from_name: formData.fullName,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setStatus('success');
          // Reset form fields after successful submission
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            service: defaultService || servicesData[0]?.title || 'Website Design and Development',
            subject: defaultService ? `Inquiry regarding ${defaultService}` : '',
            message: '',
            consent: false,
            botcheck: '',
          });
          setErrors({});
        } else {
          throw new Error(data.message || 'Submission was not accepted by the mail gateway.');
        }
      } else {
        // Clear configuration guidance when Web3Forms key is not yet set
        setStatus('error');
        setErrorMessage(
          'Web3Forms access key is not configured (VITE_WEB3FORMS_ACCESS_KEY). Please configure your key in environment settings or contact us directly at ' +
            companyConfig.contact.primaryEmail +
            '.'
        );
      }
    } catch (err: any) {
      console.error('Contact Form Error:', err);
      setStatus('error');
      setErrorMessage(
        err.message ||
          `Unable to send at this moment. Please reach out directly to ${companyConfig.contact.primaryEmail} or call ${companyConfig.contact.displayPhone}.`
      );
    }
  };

  return (
    <div className={`bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-xl p-6 sm:p-8 lg:p-10 text-slate-200 ${className}`}>
      {status === 'success' ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 bg-[#00D4FF]/20 text-[#00D4FF] rounded-full flex items-center justify-center mx-auto border border-[#00D4FF]/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">Inquiry Successfully Received!</h3>
          <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
            Thank you, <span className="font-bold text-white">{formData.fullName}</span>. An engineer from <span className="text-[#00D4FF] font-semibold">{companyConfig.name}</span> will review your technical requirements for <strong>{formData.service}</strong> and respond within 2 to 4 business hours.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  service: servicesData[0]?.title || 'Website Design and Development',
                  subject: '',
                  message: '',
                  botcheck: '',
                });
                setErrors({});
              }}
              className="px-6 py-2.5 rounded-sm bg-slate-900 text-xs font-bold uppercase tracking-widest text-[#00D4FF] hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
            >
              Send Another Inquiry
            </button>
            <WhatsAppButton
              variant="service"
              serviceName={formData.service || 'Technology Services'}
              label="Continue on WhatsApp"
              className="px-6 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest"
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="border-b border-slate-800 pb-4 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
              Direct Communication Channel
            </span>
            <h3 className="text-xl font-bold text-white">
              Request a Technical Consultation or Quote
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Fill out this form and our engineering team will respond promptly with recommendations and itemized pricing.
            </p>
          </div>

          {status === 'error' && (
            <div className="p-4 bg-red-950/60 border border-red-800/80 rounded-sm flex items-start gap-3 text-red-300 text-xs leading-relaxed">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <strong className="block text-white font-bold">Submission Notice:</strong>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Honeypot field (hidden from human view for anti-spam) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="botcheck">Do not fill this field</label>
            <input
              type="text"
              id="botcheck"
              name="botcheck"
              value={formData.botcheck}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
                Full Name <span className="text-[#00D4FF]">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Samuel K. Johnson"
                className={`w-full px-4 py-2.5 rounded-sm bg-slate-900/90 border ${
                  errors.fullName ? 'border-red-500' : 'border-slate-700'
                } text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] text-sm transition`}
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
                Email Address <span className="text-[#00D4FF]">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className={`w-full px-4 py-2.5 rounded-sm bg-slate-900/90 border ${
                  errors.email ? 'border-red-500' : 'border-slate-700'
                } text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] text-sm transition`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Phone Number and Service Required */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
                Phone / WhatsApp Number <span className="text-[#00D4FF]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-4 py-2.5 rounded-sm bg-slate-900/90 border ${
                  errors.phone ? 'border-red-500' : 'border-slate-700'
                } text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] text-sm transition`}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="service" className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
                Service Required <span className="text-[#00D4FF]">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-sm bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-[#00D4FF] text-sm transition"
              >
                {servicesData.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="General IT Consultation">General IT Consultation</option>
                <option value="Urgent Cyber Incident Response">Urgent Cyber Incident Response</option>
                <option value="Custom Integrated Solution">Custom Integrated Solution</option>
              </select>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
              Subject <span className="text-[#00D4FF]">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g., CCTV Installation for Warehouse or School Management System Demo"
              className={`w-full px-4 py-2.5 rounded-sm bg-slate-900/90 border ${
                errors.subject ? 'border-red-500' : 'border-slate-700'
              } text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] text-sm transition`}
            />
            {errors.subject && (
              <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-1.5">
              Message &amp; Project Requirements <span className="text-[#00D4FF]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your organization, current systems, project timeline, and specific goals..."
              className={`w-full px-4 py-2.5 rounded-sm bg-slate-900/90 border ${
                errors.message ? 'border-red-500' : 'border-slate-700'
              } text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] text-sm transition resize-y`}
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message}</p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div>
            <label htmlFor="consent" className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#00D4FF] focus:ring-[#00D4FF] focus:ring-offset-slate-900 cursor-pointer"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I agree to the processing of my contact information in accordance with KJT TECHNOLOGIES{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00D4FF] underline hover:text-white"
                >
                  Privacy Policy
                </a>
                . <span className="text-[#00D4FF]">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="text-red-400 text-xs mt-1">{errors.consent}</p>
            )}
          </div>

          {/* Submit Button & Privacy Notice */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold rounded-sm shadow-lg shadow-[#00D4FF]/20 hover:brightness-110 active:brightness-90 transition-all duration-200 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer disabled:opacity-70"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0A192F]" />
                  <span>Submitting Securely...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4 h-4 text-[#0A192F]" />
                </>
              )}
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
              <span>
                Protected under strict confidentiality. Your contact information is never shared.
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
