import Account from './_sections/Account.astro';
import Profile from './_sections/Profile.astro';
import Subscriptions from './_sections/Subscriptions.astro';
import Preferences from './_sections/Preferences.astro';

export const TABS = [
    {
      id: '1',
      title: 'Preferencias',
      label: 'preferences',
      component: Preferences,
      icon: 'mingcute:settings-2-fill',
    },
    {
      id: '2',
      title: 'Cuenta',
      label: 'account',
      component: Account,
      icon: 'material-symbols-light:settings-account-box-rounded',
    },
    {
      id: '3',
      title: 'Perfil',
      label: 'profile',
      component: Profile,
      icon: 'lets-icons:user-box-duotone',
    },
    {
      id: '4',
      title: 'Suscripciones',
      label: 'subscriptions',
      component: Subscriptions,
      icon: 'eos-icons:subscription-management',
    }
  ]


