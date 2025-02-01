import InfoButton from "@/components/info-button";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  infoTitle?: string;
  infoDescription?: string;
}

export function PageHeader({ 
  title, 
  description, 
  showBackButton, 
  onBack,
  infoTitle,
  infoDescription 
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        {showBackButton && (
          <button 
            onClick={onBack} 
            className="text-white/60 hover:text-white mb-4 flex items-center gap-2"
          >
            <span>←</span> Back
          </button>
        )}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-white/60 mt-1">{description}</p>}
      </div>
      {infoTitle && infoDescription && (
        <InfoButton 
          title={infoTitle}
          description={infoDescription}
        />
      )}
    </div>
  );
} 