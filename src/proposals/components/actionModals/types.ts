export interface ActionModalBasicTypes {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  proposalId: number;
  fromList?: boolean;
}
