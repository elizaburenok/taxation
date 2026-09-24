import { MainPageNavigationBar, FlowResultView } from '@ds';
import { StoreProvider, useStore } from './store';
import { DemoReset } from './components/ScenarioSwitcher';
import { AccountingHomeMp } from './pages/AccountingHomeMp';
import { CompanyOnboardingForm } from './pages/CompanyOnboardingForm';
import { TaxationSection } from './pages/TaxationSection';
import { PreviousSystemsList } from './pages/PreviousSystemsList';
import { PreviousSystemForm } from './pages/PreviousSystemForm';
import { PastSystemsEditor } from './pages/PastSystemsEditor';
import './app.css';

function Screens() {
  const { screen } = useStore();
  switch (screen) {
    case 'home':
      return <AccountingHomeMp />;
    case 'onboarding-form':
      return <CompanyOnboardingForm />;
    case 'taxation':
      return <TaxationSection />;
    case 'previous-list':
      return <PreviousSystemsList />;
    case 'system-form':
      return <PreviousSystemForm />;
    case 'sno-editor':
      return <PastSystemsEditor />;
    default:
      return <AccountingHomeMp />;
  }
}

function Shell() {
  const { result, closeResult } = useStore();
  return (
    <div className="app-root">
      <div className="app-topbar">
        <MainPageNavigationBar
          activeNavItem="services"
          customer="Носовец О.Н., ИП"
          avatarInitials="НО"
          isSecondLine
          tin="ИНН 6658 3754 26"
        />
      </div>

      <Screens />

      <div className="dev-switchers">
        <DemoReset />
      </div>

      <FlowResultView
        isOpen={result !== null}
        state={result?.state ?? 'success'}
        title={result?.title ?? ''}
        text={result?.text ?? ''}
        onDone={closeResult}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
