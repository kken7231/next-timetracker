'use client';
import { GSymbolOutlined } from '@/app/components/GSymbol';
import { signInWithEmail } from '@/lib/firebase/auth';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

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
    <div className="container m-auto flex flex-col gap-10 justify-center items-center py-10 min-h-screen ">
      <div className="flex flex-col gap-10">
        <Input
          size="lg"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          size="lg"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isPasswordVisible ? (
                <GSymbolOutlined size={24} iconColor="black">
                  visibility
                </GSymbolOutlined>
              ) : (
                <GSymbolOutlined size={24} iconColor="black">
                  visibility_off
                </GSymbolOutlined>
              )}
            </button>
          }
          className="w-full"
        />
      </div>
      <div className="flex flex-col">
        {status !== '' && <p id="field-desc">{status}</p>}
        <Button className="m-auto" type="submit" onClick={handleSubmit}>
          Sign In
        </Button>{' '}
      </div>
    </div>
  );
}
