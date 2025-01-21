import {
  DependencyList,
  EffectCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import isEqual from 'lodash/isEqual';

const areDependenciesEqual = (
  oldDeps: DependencyList | undefined,
  newDeps: DependencyList
) => {
  return oldDeps?.every((dep, index) => {
    if (dep instanceof Function && newDeps[index] instanceof Function) {
      return dep.toString() === (newDeps[index] as Function).toString();
    }
    return isEqual(dep, newDeps[index]);
  });
};

export const useDeepEffect = (
  callback: EffectCallback,
  dependencies: DependencyList,
  isLayoutEffect?: boolean
) => {
  const currentDependenciesRef = useRef<DependencyList>();
  if (!areDependenciesEqual(currentDependenciesRef.current, dependencies)) {
    // if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  const effect = isLayoutEffect ? useEffect : useLayoutEffect;

  effect(callback, [currentDependenciesRef.current]);
};

export default useDeepEffect;
