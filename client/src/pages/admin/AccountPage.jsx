import { useEffect, useState } from 'react';
import { api, tokenStore } from '../../lib/api';
import { TextInput } from '../../components/admin/Field';
import FormShell from '../../components/admin/FormShell';
import { useToast } from '../../components/admin/Toast';
import { useAuth } from '../../context/AuthContext';

export default function AccountPage() {
  const toast = useToast();
  const { admin, setAdmin } = useAuth();
  const [details, setDetails] = useState({ name: '', email: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    document.title = 'Account — Admin';
    if (admin) setDetails({ name: admin.name || '', email: admin.email || '' });
  }, [admin]);

  const saveDetails = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.patch('/auth/account', details);
      setAdmin(res.admin);
      toast.success('Account details updated.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      toast.error('The two new passwords do not match.');
      return;
    }
    setPwBusy(true);
    try {
      const res = await api.patch('/auth/password', {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      tokenStore.set(res.token);
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password updated. Other signed-in sessions have been ended.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <FormShell
        title="Account"
        intro="The administrator sign-in for this website."
        onSubmit={saveDetails}
        busy={busy}
        saveLabel="Save details"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput label="Name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
          <TextInput label="Email" type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
        </div>
      </FormShell>

      <form onSubmit={savePassword} className="mt-4 border-t border-line pt-9 pb-24" noValidate>
        <h2 className="font-display text-[1.6rem] text-ink">Change password</h2>
        <p className="mt-2 max-w-[52ch] text-[0.88rem] leading-relaxed text-clay">
          Use at least 10 characters. Changing it signs out every other device.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
            className="sm:col-span-2"
          />
          <TextInput
            label="New password"
            type="password"
            autoComplete="new-password"
            value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
          />
          <TextInput
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={pw.confirm}
            onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
          />
        </div>

        <button type="submit" disabled={pwBusy} className="btn-solid mt-7 !py-3 text-[0.7rem] disabled:opacity-70">
          <span>{pwBusy ? 'Updating' : 'Update password'}</span>
        </button>
      </form>
    </div>
  );
}
