import React, { useEffect } from 'react';

type UseClickOutsideType = {
  ref: React.RefObject<HTMLDivElement>;
  outsideClickFunc: () => void;
  additionalCondition?: boolean;
};

export function useClickOutside({
  ref,
  outsideClickFunc,
  additionalCondition,
}: UseClickOutsideType) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        additionalCondition
      ) {
        outsideClickFunc();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, additionalCondition]);
}
