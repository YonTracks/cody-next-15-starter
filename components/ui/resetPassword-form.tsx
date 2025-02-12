'use client';

import { lusitana } from '@/components/ui/fonts';
import {
    AtSymbolIcon,
    ExclamationCircleIcon,
    KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { resetPassword } from '@/lib/actions';
import Link from 'next/link';

export default function ResetPasswordForm() {
    const [errorMessage, formAction, isPending] = useActionState(resetPassword, undefined);

    return (
        <form action={formAction} className="space-y-3">
            <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                    Reset Your Password
                </h1>
                <div className="w-full space-y-4">
                    {/* Email Input */}
                    <div>
                        <label
                            className="mb-3 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    {/* New Password Input */}
                    <div>
                        <label
                            className="mb-3 block text-xs font-medium text-gray-900"
                            htmlFor="newPassword"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                placeholder="Enter your new password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    {/* Confirm Password Input */}
                    <div>
                        <label
                            className="mb-3 block text-xs font-medium text-gray-900"
                            htmlFor="confirmPassword"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your new password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Reset Password <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
                {errorMessage && (
                    <div
                        className="flex h-10 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <div className="flex w-full h-10 items-center rounded-lg p-4 text-sm font-medium">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500 ml-2">{errorMessage}</p>
                            {errorMessage === "User not found" && (
                                <Link href="/signup" className="ml-auto text-sm hover:text-blue-500">
                                    Signup
                                </Link>
                            )}
                            {errorMessage === "Password reset successfully!" && (
                                <Link href="/login" className="ml-auto text-sm hover:text-blue-500">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}
