/** @module useModalContext */

import { useSelector } from "react-redux";

const useModalContext = modalId => {
  const toggles = useSelector(state => state.toggleState?.toggles) ?? [];

  const idx = toggles.map(toggle => toggle.id)?.indexOf(modalId);

  const isOpen = Boolean(idx !== -1);

  return {
    isOpen,
    ...toggles[idx]
  };
};

export default useModalContext;
