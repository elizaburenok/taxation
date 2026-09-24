import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_BOOKKEEPING_START, DEFAULT_CALC_START, type PastSystem } from './data';

/** Экраны прототипа. */
export type Screen =
  | 'home'
  | 'onboarding-form'
  | 'taxation'
  | 'previous-list'
  | 'system-form'
  | 'sno-editor';

/** Откуда открыта форма добавления системы — влияет на возврат и заголовок. */
export type FormOrigin = 'onboarding' | 'section';

export interface ResultState {
  state: 'success' | 'error';
  title: string;
  text: React.ReactNode;
}

interface StoreValue {
  screen: Screen;
  formOrigin: FormOrigin;
  go: (screen: Screen, formOrigin?: FormOrigin) => void;
  back: () => void;
  /** Заменить весь стек экранов (для «приземления» после сохранения). */
  resetTo: (screens: Screen[]) => void;
  /** Полный сброс демо к стартовому состоянию онбординга. */
  resetDemo: () => void;

  previousSystems: PastSystem[];
  addSystem: (system: PastSystem) => void;
  updateSystem: (id: string, patch: Partial<PastSystem>) => void;
  removeSystem: (id: string) => void;
  isDuplicate: (snoId: string, start: string) => boolean;

  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;
  pastSnoTaskDone: boolean;
  setPastSnoTaskDone: (v: boolean) => void;

  /** Дата начала расчёта (dd.mm.yyyy) — двигается в редакторе прошлых СНО. */
  calcStart: string;
  setCalcStart: (v: string) => void;
  /**
   * Исходный «год начала работы с Точкой» (dd.mm.yyyy) — сохраняется из онбординга,
   * служит верхней границей разрыва прошлых СНО в кабинете.
   */
  bookkeepingStart: string;
  setBookkeepingStart: (v: string) => void;

  result: ResultState | null;
  showResult: (r: ResultState) => void;
  closeResult: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<Screen[]>(['home']);
  const [formOrigin, setFormOrigin] = useState<FormOrigin>('section');
  const [previousSystems, setPreviousSystems] = useState<PastSystem[]>([]);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [pastSnoTaskDone, setPastSnoTaskDone] = useState(false);
  const [calcStart, setCalcStart] = useState<string>(DEFAULT_CALC_START);
  const [bookkeepingStart, setBookkeepingStart] = useState<string>(DEFAULT_BOOKKEEPING_START);
  const [result, setResult] = useState<ResultState | null>(null);

  const value = useMemo<StoreValue>(() => {
    const resetDemo = () => {
      // Возврат к стартовому состоянию онбординга для повторного прогона демо.
      setStack(['home']);
      setPreviousSystems([]);
      setOnboardingDone(false);
      setPastSnoTaskDone(false);
      setCalcStart(DEFAULT_CALC_START);
      setBookkeepingStart(DEFAULT_BOOKKEEPING_START);
      setResult(null);
    };

    const go = (screen: Screen, origin?: FormOrigin) => {
      if (origin) setFormOrigin(origin);
      setStack((prev) => [...prev, screen]);
    };

    const back = () => {
      setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    const resetTo = (screens: Screen[]) => {
      setStack(screens.length ? screens : ['home']);
    };

    const addSystem = (system: PastSystem) => {
      setPreviousSystems((prev) => [...prev, system]);
    };

    const updateSystem = (id: string, patch: Partial<PastSystem>) => {
      setPreviousSystems((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    };

    const removeSystem = (id: string) => {
      setPreviousSystems((prev) => prev.filter((s) => s.id !== id));
    };

    const isDuplicate = (snoId: string, start: string) =>
      previousSystems.some((s) => s.snoId === snoId && s.start === start);

    return {
      screen: stack[stack.length - 1],
      formOrigin,
      go,
      back,
      resetTo,
      resetDemo,
      previousSystems,
      addSystem,
      updateSystem,
      removeSystem,
      isDuplicate,
      onboardingDone,
      setOnboardingDone,
      pastSnoTaskDone,
      setPastSnoTaskDone,
      calcStart,
      setCalcStart,
      bookkeepingStart,
      setBookkeepingStart,
      result,
      showResult: setResult,
      closeResult: () => setResult(null),
    };
  }, [stack, formOrigin, previousSystems, onboardingDone, pastSnoTaskDone, calcStart, bookkeepingStart, result]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
