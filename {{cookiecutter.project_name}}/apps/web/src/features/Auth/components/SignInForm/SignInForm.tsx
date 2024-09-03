import { useState, ChangeEvent, FormEvent } from 'react';
import { Button, IconName, Input } from 'ui';
import { useAuth } from '@/hooks/useAuth';

function LoginForm() {
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await login(credentials);
  };

  const handleChange = (key: keyof typeof credentials, event: ChangeEvent<HTMLInputElement>) => {
    const state = { ...credentials };
    state[key] = event.target.value;
    setCredentials(state);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col w-full" autoComplete="off">
      <Input
        id="username"
        name="username"
        type="email"
        icon={IconName.userTwo}
        value={credentials.username}
        placeholder="Login"
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange('username', event)}
      />
      <Input
        id="password"
        name="password"
        type="password"
        icon={IconName.lock}
        value={credentials.password}
        placeholder="Password"
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange('password', event)}
      />
      <Button
        type="submit"
        disabled={!credentials.username.trim() || !credentials.password.trim()}
        className="bg-blue-700 hover:bg-blue-700/75 text-white text-base font-semibold px-6 py-3"
      >
        Log In
      </Button>
    </form>
  );
}

export function AgreeTermsForm() {
  const [termsViewed, setTermsViewed] = useState(false);
  const { agreeTerms, logout, terms } = useAuth();
  if (!terms) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (terms) {
      await agreeTerms();
    }
  };

  const date = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(terms.published_at));

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col w-full" autoComplete="off">
      <p className="text-md text-gray-500 text-center">
        Please review and accept the{' '}
        <a
          href={terms.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-700 hover:underline font-semibold block"
          onClick={() => setTermsViewed(true)}
        >
          Terms and Conditions ↗
        </a>
        published on {date}
      </p>
      <div className="flex justify-between mt-6">
        <Button
          type="submit"
          className="bg-blue-700 hover:bg-blue-700/75 text-white text-base font-semibold px-6 py-3 mr-3 w-1/2"
          disabled={!termsViewed}
        >
          <span className="mr-1">✓</span> Accept
        </Button>
        <Button
          type="button"
          onClick={logout}
          className="bg-black hover:bg-black/70 text-white text-base font-semibold px-6 py-3 ml-3 w-1/2"
        >
          Log Out
        </Button>
      </div>
    </form>
  );
}

export function SignInForm() {
  const { terms } = useAuth();

  return terms ? <AgreeTermsForm /> : <LoginForm />;
}
