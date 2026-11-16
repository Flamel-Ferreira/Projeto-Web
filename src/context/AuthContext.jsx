import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SCHEMA_VERSION, STORAGE_KEYS } from '../utils/constants.js';
import {
  isStoragePersistent,
  readJSON,
  removeKey,
  writeJSON,
} from '../utils/storage.js';
import { hashPassword, verifyPassword } from '../utils/crypto.js';
import {
  normalizeEmail,
  validateConfirm,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validators.js';
import { createUserId } from '../utils/ids.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

function readUsers() {
  const data = readJSON(STORAGE_KEYS.users, null);
  if (!data || data.schemaVersion !== SCHEMA_VERSION || !Array.isArray(data.users)) {
    return [];
  }
  return data.users;
}

function writeUsers(users) {
  return writeJSON(STORAGE_KEYS.users, {
    schemaVersion: SCHEMA_VERSION,
    users,
  });
}

function buildProfile(record) {
  return {
    userId: record.id,
    displayName: record.name,
    plan: 'Pro Workspace',
    avatarColor: 'primary',
    createdAt: record.createdAt,
  };
}

function readProfile(record) {
  const stored = readJSON(STORAGE_KEYS.profile(record.id), null);

  if (
    stored &&
    stored.userId === record.id &&
    typeof stored.displayName === 'string' &&
    stored.displayName.trim()
  ) {
    return stored;
  }

  const profile = buildProfile(record);
  writeJSON(STORAGE_KEYS.profile(record.id), profile);
  return profile;
}

function loadSessionUser() {
  const session = readJSON(STORAGE_KEYS.session, null);
  if (!session || typeof session.userId !== 'string') return null;

  const record = readUsers().find((user) => user.id === session.userId);
  if (!record) {
    removeKey(STORAGE_KEYS.session);
    return null;
  }

  return { ...readProfile(record), email: record.email };
}

function firstName(displayName = '') {
  return String(displayName).trim().split(/\s+/)[0] || '';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSessionUser());
  const { showToast } = useToast();
  const warnedStorage = useRef(false);

  useEffect(() => {
    if (!isStoragePersistent() && !warnedStorage.current) {
      warnedStorage.current = true;
      showToast(
        'Armazenamento local indisponível. Os dados serão mantidos apenas nesta aba.',
        'error',
        { duration: 6000 },
      );
    }
  }, [showToast]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEYS.session) {
        setUser(loadSessionUser());
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const emailCheck = validateEmail(email);
      if (!emailCheck.valid) {
        return { ok: false, error: emailCheck.error };
      }
      if (!password) {
        return { ok: false, error: 'Informe sua senha.' };
      }

      const users = readUsers();
      const record = users.find(
        (entry) => normalizeEmail(entry.email) === emailCheck.value,
      );

      const genericError = 'E-mail ou senha incorretos.';

      if (!record) {
        showToast(genericError, 'error');
        return { ok: false, error: genericError };
      }

      let passwordMatches = false;
      try {
        passwordMatches = await verifyPassword(password, record.password);
      } catch (error) {
        const message =
          error?.message ||
          'Não foi possível validar a senha neste navegador. Use localhost ou HTTPS.';
        showToast(message, 'error');
        return { ok: false, error: message };
      }

      if (!passwordMatches) {
        showToast(genericError, 'error');
        return { ok: false, error: genericError };
      }

      const now = new Date().toISOString();
      const updatedUsers = users.map((entry) =>
        entry.id === record.id ? { ...entry, lastLoginAt: now } : entry,
      );
      writeUsers(updatedUsers);

      const profile = readProfile(record);
      const session = {
        userId: record.id,
        email: record.email,
        createdAt: now,
      };
      writeJSON(STORAGE_KEYS.session, session);
      setUser({ ...profile, email: record.email });

      showToast(
        `Bem-vindo(a) de volta, ${firstName(profile.displayName)}!`,
        'success',
      );
      return { ok: true };
    },
    [showToast],
  );

  const register = useCallback(
    async ({ name, email, password, confirm }) => {
      const nameCheck = validateName(name);
      if (!nameCheck.valid) return { ok: false, error: nameCheck.error };

      const emailCheck = validateEmail(email);
      if (!emailCheck.valid) return { ok: false, error: emailCheck.error };

      const passwordCheck = validatePassword(password);
      if (!passwordCheck.valid) return { ok: false, error: passwordCheck.error };

      const confirmCheck = validateConfirm(password, confirm);
      if (!confirmCheck.valid) return { ok: false, error: confirmCheck.error };

      const users = readUsers();
      const alreadyExists = users.some(
        (entry) => normalizeEmail(entry.email) === emailCheck.value,
      );

      if (alreadyExists) {
        const message = 'Este e-mail já está cadastrado.';
        showToast(message, 'error');
        return { ok: false, error: message };
      }

      let passwordHash;
      try {
        passwordHash = await hashPassword(password);
      } catch (error) {
        const message =
          error?.message ||
          'Não foi possível proteger sua senha neste navegador. Use localhost ou HTTPS.';
        showToast(message, 'error');
        return { ok: false, error: message };
      }

      const now = new Date().toISOString();
      const record = {
        id: createUserId(),
        email: emailCheck.value,
        name: nameCheck.value,
        password: passwordHash,
        createdAt: now,
        lastLoginAt: now,
      };

      if (!writeUsers([...users, record])) {
        const message = 'Não foi possível salvar seus dados. Verifique o armazenamento do navegador.';
        showToast(message, 'error');
        return { ok: false, error: message };
      }

      const profile = buildProfile(record);
      writeJSON(STORAGE_KEYS.profile(record.id), profile);
      writeJSON(STORAGE_KEYS.session, {
        userId: record.id,
        email: record.email,
        createdAt: now,
      });

      setUser({ ...profile, email: record.email });
      showToast(
        `Conta criada com sucesso. Bem-vindo(a), ${firstName(record.name)}!`,
        'success',
      );
      return { ok: true };
    },
    [showToast],
  );

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.session);
    setUser(null);
    showToast('Você saiu da sua conta.', 'info');
  }, [showToast]);

  const updateProfile = useCallback(
    (patch = {}) => {
      if (!user) return { ok: false, error: 'Sessão expirada.' };

      const nextName = patch.displayName ?? user.displayName;
      const nameCheck = validateName(nextName);
      if (!nameCheck.valid) return { ok: false, error: nameCheck.error };

      const users = readUsers();
      const index = users.findIndex((entry) => entry.id === user.userId);
      if (index < 0) return { ok: false, error: 'Usuário não encontrado.' };

      const storedProfile = readJSON(
        STORAGE_KEYS.profile(user.userId),
        buildProfile(users[index]),
      );

      const nextProfile = {
        ...storedProfile,
        displayName: nameCheck.value,
        updatedAt: new Date().toISOString(),
      };

      writeJSON(STORAGE_KEYS.profile(user.userId), nextProfile);

      const nextUsers = [...users];
      nextUsers[index] = { ...nextUsers[index], name: nameCheck.value };
      writeUsers(nextUsers);

      setUser({ ...nextProfile, email: user.email });
      showToast('Perfil atualizado.', 'success');
      return { ok: true };
    },
    [showToast, user],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBooting: false,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  }
  return context;
}
