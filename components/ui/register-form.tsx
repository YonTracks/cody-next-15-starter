'use client';

import { useState } from 'react';
import { lusitana } from '@/components/ui/fonts';
import {
    AtSymbolIcon,
    KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { registerUser } from '@/lib/actions';
import Link from 'next/link';
import { Button2 } from '@/components/ui/button2';

export default function RegisterForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        try {
            await registerUser(new FormData(event.currentTarget));
        } catch (error) {
            if (error == `Error: duplicate key value violates unique constraint "users_email_key"`)

                setError("Email already in use")
        }

    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Welcome to My-App.
                </h1>
                <div className="w-full">
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="relative mt-4">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                        />
                        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div className="relative mt-4">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Create password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    <div className="relative mt-4">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                    {error && (
                        <div className="mt-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>
                <Button2 className="mt-4 w-full">
                    Signup <ArrowRightIcon className="ml-auto size-5 text-gray-50" />
                </Button2>
                <div className="flex w-full h-10 items-center rounded-lg p-4 text-sm font-medium">
                    <p className="text-sm">Already have an account?</p>
                    <Link href="/login" className="ml-auto text-sm text-blue-600 hover:text-blue-500">
                        Login
                    </Link>
                </div>
            </div>
        </form>
    );
}
