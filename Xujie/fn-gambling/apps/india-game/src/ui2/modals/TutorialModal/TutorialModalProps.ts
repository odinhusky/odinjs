import { PayActivationResult } from "@libs/mode2/external/api/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint";

export interface TutorialModalProps {
  type: PayActivationResult;
  onClose?: () => void;
}
