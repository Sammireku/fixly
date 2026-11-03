import React from 'react';
import FixlyMobileEcosystem from './FixlyMobileEcosystem';

interface WireframeFlowsViewProps {
  onStartOnDemand: () => void;
  onStartProject: () => void;
  onOpenSosModal: () => void;
  onOpenDisputeModal: () => void;
}

export const WireframeFlowsView: React.FC<WireframeFlowsViewProps> = () => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <FixlyMobileEcosystem />
    </div>
  );
};
