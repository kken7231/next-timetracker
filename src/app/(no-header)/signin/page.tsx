'use client';
import { signInWithEmail } from '@/lib/firebase/auth';
import { Button, Description, Field, Input, Label } from '@headlessui/react';
import { error } from 'console';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    console.log('aaa');
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (error) {
      console.error(`Error signing with an email: ${error}`);
      setStatus(`Error signing with an email: ${error}`);
    }
  };

  return (
    <div className="container m-auto flex flex-col gap-10 justify-center items-center py-10 min-h-full ">
      <Field>
        <Label id="field-label">E-mail</Label>
        {/* <Description id="field-desc">
            Use your real name so people will recognize you.
          </Description> */}
        <Input
          type="email"
          id="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </Field>
      <Field>
        <Label id="field-label">Password</Label>
        {/* <Description id="field-desc">
            Use your real name so people will recognize you.
          </Description> */}
        <Input
          type="password"
          id="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </Field>
      <Field className="flex flex-col">
        {status !== '' && <Label id="field-desc">{status}</Label>}
        <Button
          id="btn"
          className="m-auto"
          type="submit"
          onClick={handleSubmit}
        >
          Sign In
        </Button>{' '}
      </Field>
    </div>
  );
}
