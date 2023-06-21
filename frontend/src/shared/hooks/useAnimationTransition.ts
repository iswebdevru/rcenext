import useTransition from 'react-transition-state';

export function useAnimationTransition() {
  return useTransition({
    timeout: 150,
    preEnter: true,
  });
}
