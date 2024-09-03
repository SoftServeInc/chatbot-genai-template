import { useNavigate } from 'react-router-dom';
import { IconName } from 'ui';
import { AuthLayout } from '@/components/templates';

import PrimaryLogo from '@/assets/images/logo/Logo-Dark-Opt B.svg?react';
import AlternativeLogo from '@/assets/images/logo/Tools-Logo.svg?react';

export function AuthPage() {
  const navigate = useNavigate();
  const handleToggle = (toggled: boolean) => {
    if (toggled) {
      return navigate('/auth/configure-bot');
    }
    return navigate(-1);
  };

  return (
    <AuthLayout
      logo={{
        primary: PrimaryLogo,
        alternative: AlternativeLogo,
      }}
      toggle={{
        icon: {
          primary: IconName.settings,
          alternative: IconName.userTwo,
        },
        onToggle: handleToggle,
      }}
      description={{
        primary: 'Use credentials provided by SoftServe',
        alternative: 'Development mode access',
      }}
    />
  );
}
