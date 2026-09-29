import React from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';

interface StepItem {
  step: number;
  name: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ArticleEditorStepBarProps {
  steps: StepItem[];
  currentStep: number;
  onSelectStep: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  workflowMode: 'stepper' | 'all';
  onToggleMode: (mode: 'stepper' | 'all') => void;
}

export const ArticleEditorStepBar: React.FC<ArticleEditorStepBarProps> = ({
  steps,
  currentStep,
  onSelectStep,
  isStepComplete,
  workflowMode,
  onToggleMode,
}) => {
  const completedCount = steps.filter((s) => isStepComplete(s.step)).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Header: Progress indicator & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                6-Step Article Creation Workflow
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30">
                {completedCount}/{steps.length} Complete
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Follow our editorial checklist to ensure clean titles, SEO readiness, and verified media.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onToggleMode('stepper')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              workflowMode === 'stepper'
                ? 'bg-[#00D4FF] text-[#0A192F] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Step Wizard</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              workflowMode === 'all'
                ? 'bg-[#00D4FF] text-[#0A192F] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Sections</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00D4FF] via-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 6 Step Interactive Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((item) => {
          const Icon = item.icon;
          const isComplete = isStepComplete(item.step);
          const isActive = workflowMode === 'stepper' && currentStep === item.step;

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => onSelectStep(item.step)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                isActive
                  ? 'bg-slate-800 border-[#00D4FF] shadow-lg shadow-[#00D4FF]/10 ring-1 ring-[#00D4FF]/50'
                  : isComplete
                  ? 'bg-slate-900/70 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-slate-800/80'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              {/* Step indicator & status badge */}
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-[#00D4FF] text-[#0A192F]'
                      : isComplete
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : item.step}
                </span>

                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-[#00D4FF]'
                      : isComplete
                      ? 'text-emerald-400'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
              </div>

              {/* Step Name & Description */}
              <div>
                <div
                  className={`text-xs font-bold truncate ${
                    isActive
                      ? 'text-white'
                      : isComplete
                      ? 'text-slate-200'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.step}. {item.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {item.shortDesc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface StepNavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  saving: boolean;
  isCurrentStepComplete: boolean;
}

export const StepNavigationControls: React.FC<StepNavigationControlsProps> = ({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onSaveDraft,
  onPublish,
  saving,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mt-6 shadow-xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentStep <= 1}
          onClick={onPrev}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <span className="text-xs text-slate-400 px-2 font-mono">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={onSaveDraft}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold transition shadow-lg shadow-[#00D4FF]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Continue to Step {currentStep + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            onClick={onPublish}
            className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish Article Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
