import { component$, useStylesScoped$, useSignal, $ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import { authService } from '../../services/AuthService';
import styles from './LoginView.css?inline';

interface LoginViewProps {
  onLoginSuccess$: PropFunction<() => void>;
}

export const LoginView = component$<LoginViewProps>((props) => {
  useStylesScoped$(styles);

  const password = useSignal('');
  const errorMessage = useSignal('');

  const handleLogin = $(async () => {
    const success = await authService.login(password.value);
    if (!success) {
      errorMessage.value = 'Invalid password. Please try again.';
      password.value = ''; 
    } else {
      errorMessage.value = ''; 
      props.onLoginSuccess$(); // Notify parent about successful login
    }
  });

  return (
    <div class="login-container">
      <div class="login-form">
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Password"
          value={password.value}
          onInput$={(e) => password.value = (e.target as HTMLInputElement).value}
          onKeyDown$={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />
        <button onClick$={handleLogin}>Login</button>
        {errorMessage.value && <p class="login-error">{errorMessage.value}</p>}
      </div>
    </div>
  );
});
