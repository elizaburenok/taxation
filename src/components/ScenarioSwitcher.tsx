import { useStore } from '../store';

/** Плавающая dev-кнопка для повторного прогона демо со стартового онбординга. */
export function DemoReset() {
  const { resetDemo } = useStore();

  return (
    <div className="scenario-switcher" role="group" aria-label="Управление демо">
      <span className="scenario-switcher__label ts-400-s">Демо</span>
      <div className="scenario-switcher__segment">
        <button
          type="button"
          className="scenario-switcher__option ts-500-s"
          onClick={resetDemo}
        >
          Сбросить демо
        </button>
      </div>
    </div>
  );
}
